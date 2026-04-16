import React from 'react';

interface VersionPreviewBannerProps {
  timestamp: string;
  onApply: () => void;
  onDiscard: () => void;
  isApplying?: boolean;
}

/**
 * Replaces the normal editor toolbar when previewing a historical version.
 * Shows the version timestamp, an "Apply" button, and a "Discard" button.
 * The normal Save / Publish / Revert to Published buttons must NOT be
 * rendered alongside this component.
 */
export const VersionPreviewBanner: React.FC<VersionPreviewBannerProps> = ({
  timestamp,
  onApply,
  onDiscard,
  isApplying = false,
}) => {
  const formatted = new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Version label */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          background: 'rgba(129, 140, 248, 0.12)',
          color: 'var(--status-draft, #818cf8)',
          border: '1px solid rgba(129, 140, 248, 0.3)',
        }}
      >
        <svg
          width="12"
          height="12"
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
        Previewing: {formatted}
      </span>

      {/* Apply version button */}
      <button
        onClick={onApply}
        disabled={isApplying}
        style={{
          padding: '6px 14px',
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

      {/* Discard / back to current */}
      <button
        onClick={onDiscard}
        disabled={isApplying}
        style={{
          padding: '6px 14px',
          borderRadius: '4px',
          border: '1px solid var(--border-glow, rgba(255,255,255,0.12))',
          background: 'transparent',
          color: 'var(--text-muted, #94a3b8)',
          fontWeight: 500,
          fontSize: '13px',
          cursor: isApplying ? 'not-allowed' : 'pointer',
          opacity: isApplying ? 0.5 : 1,
        }}
      >
        Back to Current
      </button>
    </div>
  );
};
