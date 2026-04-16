import React from 'react';

interface VersionHistoryButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

/**
 * Toolbar button that opens the version history panel.
 * Renders a clock-like icon using SVG.
 */
export const VersionHistoryButton: React.FC<VersionHistoryButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title="Version History"
    aria-label="Open version history"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '6px 12px',
      borderRadius: '4px',
      border: isActive
        ? '1px solid rgba(129, 140, 248, 0.6)'
        : '1px solid var(--border-glow, rgba(255,255,255,0.12))',
      background: isActive
        ? 'rgba(129, 140, 248, 0.15)'
        : 'transparent',
      color: isActive
        ? 'var(--status-draft, #818cf8)'
        : 'var(--text-muted, #94a3b8)',
      fontWeight: 500,
      fontSize: '13px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background 0.15s, border-color 0.15s, color 0.15s',
    }}
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    History
  </button>
);
