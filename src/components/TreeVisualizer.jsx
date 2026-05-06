import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TreeNode from './TreeNode';
import DetailPanel from './DetailPanel';
import { TreeProvider } from '../context/TreeContext';
import {
  buildLayout,
  searchTree,
  findAncestors,
  getTreeStats,
  findPathToNode,
} from '../utils/treeLayout';
import treeData from '../data/treeData';
import { GradientBackground } from './ui/paper-design-shader-background';

const nodeTypes = { treeNode: TreeNode };

function TreeVisualizerInner() {
  const { fitView } = useReactFlow();

  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search results
  const searchResults = useMemo(
    () => searchTree(treeData, searchQuery),
    [searchQuery]
  );

  // Highlighted ancestors for hovered node
  const hoveredAncestors = useMemo(() => {
    if (!hoveredNodeId) return new Set();
    return findAncestors(treeData, hoveredNodeId);
  }, [hoveredNodeId]);

  // Toggle collapse/expand
  const handleToggle = useCallback((nodeId) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Select a node
  const handleSelectNode = useCallback((nodeId) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  // Hover a node
  const handleHoverNode = useCallback((nodeId) => {
    setHoveredNodeId(nodeId);
  }, []);

  // Expand all
  const handleExpandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  // Collapse all (collapse every node that has children)
  const handleCollapseAll = useCallback(() => {
    const allWithChildren = new Set();
    function collectParents(node) {
      if (node.children && node.children.length > 0) {
        allWithChildren.add(node.id);
        node.children.forEach(collectParents);
      }
    }
    collectParents(treeData);
    setCollapsedIds(allWithChildren);
  }, []);

  // Search-driven expand: expand path to search results
  useEffect(() => {
    if (searchResults.length > 0) {
      const idsToExpand = new Set();
      searchResults.forEach((resultId) => {
        const path = findPathToNode(treeData, resultId);
        path.forEach((id) => idsToExpand.add(id));
      });
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        idsToExpand.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, [searchResults]);

  // Build layout — only depends on collapsedIds (NOT hover/selection state)
  const { nodes, edges } = useMemo(
    () => buildLayout(treeData, collapsedIds),
    [collapsedIds]
  );

  // Fit view when layout changes (delayed to coordinate with CSS animation)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 450);
    return () => clearTimeout(timeout);
  }, [collapsedIds, fitView]);

  // Context value — provides interactive state to TreeNode via context
  const contextValue = useMemo(
    () => ({
      hoveredAncestors,
      selectedNodeId,
      searchResults,
      onToggle: handleToggle,
      onSelectNode: handleSelectNode,
      onHoverNode: handleHoverNode,
    }),
    [
      hoveredAncestors,
      selectedNodeId,
      searchResults,
      handleToggle,
      handleSelectNode,
      handleHoverNode,
    ]
  );

  // Selected node data for detail panel
  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = nodes.find((n) => n.id === selectedNodeId);
    return node?.data || null;
  }, [selectedNodeId, nodes]);

  // Tree stats
  const stats = useMemo(() => getTreeStats(treeData), []);
  const visibleCount = nodes.length;

  return (
    <TreeProvider value={contextValue}>
      <div className="app-container">
        <GradientBackground />
        {/* ─── Toolbar ─── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="toolbar-title">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="M5 10v6" />
                <path d="M19 10v6" />
                <path d="M5 16h14" />
                <path d="M12 15L5 10" />
                <path d="M12 15l7-5" />
                <circle cx="12" cy="3" r="2" />
                <circle cx="5" cy="18" r="2" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="19" cy="18" r="2" />
              </svg>
              Tree Visualizer
            </div>
          </div>

          <div className="toolbar-right">
            {/* Search */}
            <div className="search-container">
              <svg
                className="search-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <>
                  <span className="search-results-badge">
                    {searchResults.length} found
                  </span>
                  <button
                    className="search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="toolbar-divider" />

            {/* Expand / Collapse All */}
            <button className="toolbar-btn" onClick={handleExpandAll}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Expand All
            </button>
            <button className="toolbar-btn" onClick={handleCollapseAll}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Collapse All
            </button>

            <div className="toolbar-divider" />

            {/* Fit View */}
            <button
              className="toolbar-btn"
              onClick={() => fitView({ padding: 0.2, duration: 400 })}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 00-2 2v3" />
                <path d="M21 8V5a2 2 0 00-2-2h-3" />
                <path d="M3 16v3a2 2 0 002 2h3" />
                <path d="M16 21h3a2 2 0 002-2v-3" />
              </svg>
              Fit View
            </button>
          </div>
        </div>

        {/* ─── Flow Canvas ─── */}
        <div className="flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll
            zoomOnScroll
          >
            <Background color="#2a2f3e" gap={20} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>

          {/* Detail Panel */}
          {selectedNodeData && (
            <DetailPanel
              nodeData={selectedNodeData}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </div>

        {/* ─── Stats Bar ─── */}
        <div className="stats-bar">
          <div className="stat-item">
            <span>Total Nodes:</span>
            <span className="stat-value">{stats.totalNodes}</span>
          </div>
          <div className="stat-item">
            <span>Visible:</span>
            <span className="stat-value">{visibleCount}</span>
          </div>
          <div className="stat-item">
            <span>Max Depth:</span>
            <span className="stat-value">{stats.maxDepth}</span>
          </div>
          <div className="stat-item">
            <span>Leaf Nodes:</span>
            <span className="stat-value">{stats.leafCount}</span>
          </div>
          <div className="stat-item">
            <span>Collapsed:</span>
            <span className="stat-value">{collapsedIds.size}</span>
          </div>
        </div>
      </div>
    </TreeProvider>
  );
}

export default TreeVisualizerInner;
