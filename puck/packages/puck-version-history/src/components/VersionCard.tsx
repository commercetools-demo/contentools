import React from 'react';
import type { VersionEntry } from '../types';

interface VersionCardProps {
  version: VersionEntry;
  isSelected: boolean;
  isCurrent?: boolean;
  onClick: (id: string) => void;
}

/**
 * Renders a single version entry as a selectable card showing the timestamp.
 */
export const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isSelected,
  isCurrent = false,
  onClick,
}) => {
  const formatted = new Date(version.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <button
      onClick={() => onClick(version.id)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '10px 12px',
        borderRadius: '6px',
        border: isSelected
          ? '1px solid rgba(129, 140, 248, 0.6)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        background: isSelected
          ? 'rgba(129, 140, 248, 0.12)'
          : 'rgba(255, 255, 255, 0.03)',
        cursor: 'pointer',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: isSelected
              ? 'var(--status-draft, #818cf8)'
              : 'var(--text-body, #e2e8f0)',
            fontWeight: isSelected ? 600 : 400,
          }}
        >
          {formatted}
        </span>
        {isCurrent && (
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: 'rgba(6, 214, 160, 0.15)',
              color: 'var(--status-published, #06d6a0)',
              border: '1px solid rgba(6, 214, 160, 0.3)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            current
          </span>
        )}
      </div>
    </button>
  );
};
