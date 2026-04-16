import React from 'react';
import type { PuckDataDiff } from '../types';

interface DiffSummaryProps {
  diff: PuckDataDiff;
}

const STATUS_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  added:   { icon: '+', color: 'var(--status-published, #06d6a0)', label: 'Added' },
  removed: { icon: '−', color: 'var(--status-error, #f87171)',     label: 'Removed' },
  changed: { icon: '~', color: 'var(--status-saving, #fbbf24)',    label: 'Changed' },
};

/**
 * Renders a compact diff summary listing which components changed, were
 * added, or were removed between the selected historical version and the
 * current draft.
 */
export const DiffSummary: React.FC<DiffSummaryProps> = ({ diff }) => {
  if (!diff.hasChanges) {
    return (
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-muted, #94a3b8)',
          margin: 0,
          padding: '8px 0',
          textAlign: 'center',
        }}
      >
        No differences from current version
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
        Changes vs current
      </p>

      {diff.components.map((c) => {
        const s = STATUS_ICONS[c.status];
        return (
          <div
            key={c.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: '6px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  color: s.color,
                  minWidth: '14px',
                  textAlign: 'center',
                }}
              >
                {s.icon}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-body, #e2e8f0)',
                  fontWeight: 500,
                }}
              >
                {c.type}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: s.color,
                  marginLeft: 'auto',
                  fontWeight: 600,
                }}
              >
                {s.label}
              </span>
            </div>

            {c.status === 'changed' && c.changedProps.length > 0 && (
              <div
                style={{
                  paddingLeft: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '3px',
                }}
              >
                {c.changedProps.map((prop) => (
                  <span
                    key={prop}
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      color: 'var(--status-saving, #fbbf24)',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    {prop}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {diff.rootChanges.length > 0 && (
        <div
          style={{
            padding: '6px 8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--status-saving, #fbbf24)' }}>
              ~
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-body, #e2e8f0)', fontWeight: 500 }}>
              Root
            </span>
          </div>
          <div style={{ paddingLeft: '20px', display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
            {diff.rootChanges.map((prop) => (
              <span
                key={prop}
                style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  color: 'var(--status-saving, #fbbf24)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
