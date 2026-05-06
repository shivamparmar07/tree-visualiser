import { createContext, useContext } from 'react';

/**
 * Context for sharing interactive tree state (hover, selection, search)
 * with individual TreeNode components WITHOUT passing through React Flow's
 * node data — which would cause full re-renders on every state change.
 */
const TreeContext = createContext({
  hoveredAncestors: new Set(),
  selectedNodeId: null,
  searchResults: [],
  onToggle: () => {},
  onSelectNode: () => {},
  onHoverNode: () => {},
});

export const TreeProvider = TreeContext.Provider;

export function useTreeContext() {
  return useContext(TreeContext);
}
