import { memo } from 'react';

/**
 * Detail panel that shows metadata for a selected node.
 */
function DetailPanel({ nodeData, onClose }) {
  if (!nodeData) return null;

  const { label, meta, hasChildren, isCollapsed, childCount, isRoot } = nodeData;

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <div className="detail-panel-title">{label}</div>
        <button className="detail-panel-close" onClick={onClose}>
          <svg
            width="18"
            height="18"
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
      </div>

      <div className="detail-row">
        <span className="detail-label">Role</span>
        <span className="detail-value">{isRoot ? 'Root' : 'Node'}</span>
      </div>

      {meta?.type && (
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{meta.type}</span>
        </div>
      )}

      {meta?.status && (
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className="detail-value">{meta.status}</span>
        </div>
      )}

      <div className="detail-row">
        <span className="detail-label">Has Children</span>
        <span className="detail-value">{hasChildren ? 'Yes' : 'No'}</span>
      </div>

      {hasChildren && (
        <>
          <div className="detail-row">
            <span className="detail-label">State</span>
            <span className="detail-value">
              {isCollapsed ? 'Collapsed' : 'Expanded'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Descendants</span>
            <span className="detail-value">{childCount}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(DetailPanel);
