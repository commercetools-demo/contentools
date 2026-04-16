import React from 'react';
import type { PuckDataDiff, VersionEntry } from '../types';
import { VersionCard } from './VersionCard';
import { DiffSummary } from './DiffSummary';

interface VersionHistoryPanelProps {
  isOpen: boolean;
  versions: VersionEntry[];
  isLoading: boolean;
  selectedVersionId: string | null;
  diff: PuckDataDiff | null;
  isPreviewingHistory: boolean;
  onVersionSelect: (id: string) => void;
  onApply: () => void;
  onDiscard: () => void;
  onClose: () => void;
  isApplying?: boolean;
}

/**
 * Fixed-position right-side panel that lists saved versions and shows a
 * diff summary when a version is selected for preview.
 */
export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  isOpen,
  versions,
  isLoading,
  selectedVersionId,
  diff,
  isPreviewingHistory,
  onVersionSelect,
  onApply,
  onDiscard,
  onClose,
  isApplying = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — clicking outside closes the panel */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          background: 'transparent',
        }}
      />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '320px',
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface, #1e293b)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-body, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Version History
          </span>
          <button
            onClick={onClose}
            aria-label="Close version history"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '18px',
              lineHeight: 1,
              padding: '2px 4px',
              borderRadius: '3px',
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '32px 0',
                color: 'var(--text-muted, #94a3b8)',
                fontSize: '13px',
              }}
            >
              Loading versions…
            </div>
          ) : versions.length === 0 ? (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted, #94a3b8)',
                textAlign: 'center',
                padding: '32px 0',
                margin: 0,
              }}
            >
              No saved versions yet
            </p>
          ) : (
            <>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted, #94a3b8)',
                  margin: '0 0 4px',
                }}
              >
                Saved versions
              </p>
              {versions.map((v, i) => (
                <VersionCard
                  key={v.id}
                  version={v}
                  isSelected={selectedVersionId === v.id}
                  isCurrent={i === 0}
                  onClick={onVersionSelect}
                />
              ))}
            </>
          )}

          {/* Diff summary appears below the list when a version is selected */}
          {diff && selectedVersionId && (
            <div
              style={{
                marginTop: '8px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <DiffSummary diff={diff} />
            </div>
          )}
        </div>

        {/* Footer actions — visible only when previewing a version */}
        {isPreviewingHistory && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={onApply}
              disabled={isApplying}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--accent-cyan, #00d4ff)',
                background: 'rgba(0, 212, 255, 0.1)',
                color: 'var(--accent-cyan, #00d4ff)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: isApplying ? 'not-allowed' : 'pointer',
                opacity: isApplying ? 0.5 : 1,
                boxShadow: '0 0 12px rgba(0, 212, 255, 0.15)',
              }}
            >
              {isApplying ? 'Applying…' : 'Apply this Version'}
            </button>
            <button
              onClick={onDiscard}
              disabled={isApplying}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: 'var(--text-muted, #94a3b8)',
                fontWeight: 500,
                fontSize: '13px',
                cursor: isApplying ? 'not-allowed' : 'pointer',
                opacity: isApplying ? 0.5 : 1,
              }}
            >
              Discard (Back to Current)
            </button>
          </div>
        )}
      </div>
    </>
  );
};
