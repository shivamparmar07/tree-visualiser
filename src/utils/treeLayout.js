/**
 * Tree layout engine.
 * Calculates (x, y) positions for nodes in a top-down tree,
 * centering parents above their children and spacing siblings cleanly.
 */

const NODE_WIDTH = 140;
const NODE_HEIGHT = 50;
const HORIZONTAL_GAP = 30;
const VERTICAL_GAP = 90;

/**
 * Build a flat list of React Flow nodes and edges from hierarchical tree data.
 *
 * @param {Object} root - The root tree node
 * @param {Set} collapsedIds - Set of node IDs that are collapsed
 * @returns {{ nodes: Array, edges: Array }}
 */
export function buildLayout(root, collapsedIds = new Set()) {
  const nodes = [];
  const edges = [];

  // First pass: compute widths bottom-up
  function computeWidth(node) {
    const isCollapsed = collapsedIds.has(node.id);
    
    let totalChildrenWidth = 0;
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, i) => {
        totalChildrenWidth += computeWidth(child);
        if (i < node.children.length - 1) {
          totalChildrenWidth += HORIZONTAL_GAP;
        }
      });
    }

    const hasVisibleChildren = !isCollapsed && node.children && node.children.length > 0;

    if (!hasVisibleChildren) {
      node._width = NODE_WIDTH;
    } else {
      node._width = Math.max(NODE_WIDTH, totalChildrenWidth);
    }
    
    return node._width;
  }

  // Second pass: assign positions
  function assignPositions(node, x, y, depth, isHidden = false, hiddenX = null, hiddenY = null) {
    const isCollapsed = collapsedIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    // Center this node within its allocated width
    let nodeX = x + node._width / 2 - NODE_WIDTH / 2;
    let nodeY = y;

    // If hidden, collapse to the provided hidden coordinates (parent's coordinates)
    if (isHidden) {
      nodeX = hiddenX;
      nodeY = hiddenY;
    }

    nodes.push({
      id: node.id,
      type: 'treeNode',
      position: { x: nodeX, y: nodeY },
      className: isHidden ? 'hidden-node' : '',
      style: {
        opacity: isHidden ? 0 : 1,
      },
      data: {
        label: node.label,
        meta: node.meta || {},
        isRoot: depth === 0,
        hasChildren,
        isCollapsed,
        childCount: hasChildren ? countDescendants(node) : 0,
      },
    });

    if (hasChildren) {
      const childrenHidden = isHidden || isCollapsed;
      const passHiddenX = childrenHidden ? nodeX : null;
      const passHiddenY = childrenHidden ? nodeY : null;

      let childX = x;
      node.children.forEach((child) => {
        edges.push({
          id: `e-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: '#4a5068', 
            strokeWidth: 2,
            opacity: childrenHidden ? 0 : 1,
          },
        });

        assignPositions(
          child, 
          childX, 
          y + NODE_HEIGHT + VERTICAL_GAP, 
          depth + 1,
          childrenHidden,
          passHiddenX,
          passHiddenY
        );

        if (!childrenHidden) {
          childX += child._width + HORIZONTAL_GAP;
        }
      });
    }
  }

  function countDescendants(node) {
    if (!node.children || node.children.length === 0) return 0;
    let count = node.children.length;
    node.children.forEach((child) => {
      count += countDescendants(child);
    });
    return count;
  }

  computeWidth(root);
  assignPositions(root, 0, 0, 0);

  return { nodes, edges };
}

/**
 * Find all ancestor IDs for a given node ID in the tree.
 */
export function findAncestors(root, targetId) {
  const ancestors = [];

  function dfs(node, path) {
    if (node.id === targetId) {
      ancestors.push(...path);
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (dfs(child, [...path, node.id])) return true;
      }
    }
    return false;
  }

  dfs(root, []);
  return new Set(ancestors);
}

/**
 * Search for nodes matching a query string (case-insensitive).
 * Returns an array of matching node IDs.
 */
export function searchTree(root, query) {
  const results = [];
  if (!query || query.trim() === '') return results;

  const lowerQuery = query.toLowerCase();

  function dfs(node) {
    if (node.label.toLowerCase().includes(lowerQuery)) {
      results.push(node.id);
    }
    if (node.children) {
      node.children.forEach(dfs);
    }
  }

  dfs(root);
  return results;
}

/**
 * Get total node count in the tree.
 */
export function getTreeStats(root) {
  let totalNodes = 0;
  let maxDepth = 0;
  let leafCount = 0;

  function dfs(node, depth) {
    totalNodes++;
    if (depth > maxDepth) maxDepth = depth;
    if (!node.children || node.children.length === 0) leafCount++;
    if (node.children) {
      node.children.forEach((child) => dfs(child, depth + 1));
    }
  }

  dfs(root, 0);
  return { totalNodes, maxDepth, leafCount };
}

/**
 * Find all ancestor node IDs that need to be expanded to show a target node.
 */
export function findPathToNode(root, targetId) {
  const path = [];

  function dfs(node) {
    if (node.id === targetId) return true;
    if (node.children) {
      for (const child of node.children) {
        if (dfs(child)) {
          path.push(node.id);
          return true;
        }
      }
    }
    return false;
  }

  dfs(root);
  return path;
}
