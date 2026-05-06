import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useTreeContext } from '../context/TreeContext';

/**
 * Custom tree node component for React Flow.
 * Reads interactive state (hover, selection, search) from TreeContext
 * to avoid re-renders when those states change.
 */
function TreeNode({ id, data }) {
  const { label, meta, isRoot, hasChildren, isCollapsed, childCount } = data;

  const {
    hoveredAncestors,
    selectedNodeId,
    searchResults,
    onToggle,
    onSelectNode,
    onHoverNode,
  } = useTreeContext();

  const isHighlighted = searchResults.includes(id);
  const isSelected = selectedNodeId === id;
  const isAncestorHighlighted = hoveredAncestors.has(id);

  const handleToggle = useCallback(
    (e) => {
      e.stopPropagation();
      onToggle(id);
    },
    [id, onToggle]
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onSelectNode(id);
    },
    [id, onSelectNode]
  );

  const handleMouseEnter = useCallback(() => {
    onHoverNode(id);
  }, [id, onHoverNode]);

  const handleMouseLeave = useCallback(() => {
    onHoverNode(null);
  }, [onHoverNode]);

  const classNames = [
    'tree-node',
    isRoot && 'root-node',
    isHighlighted && 'highlighted',
    isSelected && 'selected-node',
    isAncestorHighlighted && 'hovered-ancestor',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top handle (for incoming edge from parent) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none' }}
      />

      {/* Node content */}
      <div className="node-label">{label}</div>
      {meta?.type && <div className="node-meta">{meta.type}</div>}

      {/* Tooltip with full info */}
      <div className="node-tooltip">
        {label}
        {childCount > 0 && ` (${childCount} descendants)`}
      </div>

      {/* Bottom handle (for outgoing edge to children) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none' }}
      />

      {/* Expand/Collapse toggle button */}
      {hasChildren && (
        <button
          className={`toggle-btn nopan nodrag ${isCollapsed ? 'collapsed' : ''}`}
          onClick={handleToggle}
          onMouseDown={(e) => e.stopPropagation()}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default memo(TreeNode);
