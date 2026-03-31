import React from 'react';
import type { PuckStateInfo } from '@commercetools-demo/puck-types';

type BadgeVariant = 'saving' | 'unsaved' | 'draft' | 'published';

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  saving:    { bg: 'rgba(251, 191, 36, 0.12)',  color: 'var(--status-saving)',    border: 'rgba(251, 191, 36, 0.3)' },
  unsaved:   { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)',       border: 'rgba(100, 116, 139, 0.3)' },
  draft:     { bg: 'rgba(129, 140, 248, 0.12)', color: 'var(--status-draft)',     border: 'rgba(129, 140, 248, 0.3)' },
  published: { bg: 'rgba(6, 214, 160, 0.12)',   color: 'var(--status-published)', border: 'rgba(6, 214, 160, 0.3)' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant }) => {
  const s = BADGE_STYLES[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {label}
    </span>
  );
};

export interface EditorToolbarProps {
  saving: boolean;
  isDirty: boolean;
  states: PuckStateInfo;
  onSave: () => void;
  onPublish: () => void;
  onRevert: () => void;
  showPublishButton: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  saving,
  isDirty,
  states,
  onSave,
  onPublish,
  onRevert,
  showPublishButton,
}) => {
  const hasDraft = Boolean(states.draft);
  const hasPublished = Boolean(states.published);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {saving && <StatusBadge label="Saving…" variant="saving" />}
        {!saving && isDirty && <StatusBadge label="Unsaved" variant="unsaved" />}
        {!saving && !isDirty && hasDraft && (
          <StatusBadge label="Draft" variant="draft" />
        )}
        {hasPublished && <StatusBadge label="Published" variant="published" />}
      </div>

      {/* Revert button — only when there's a draft and an existing published version */}
      {hasDraft && hasPublished && (
        <button
          onClick={onRevert}
          disabled={saving}
          style={{
            padding: '6px 14px',
            borderRadius: '4px',
            border: '1px solid var(--border-glow)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '13px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1,
          }}
        >
          Revert to Published
        </button>
      )}

      {/* Save draft button */}
      <button
        onClick={onSave}
        disabled={!isDirty || saving}
        style={{
          padding: '6px 14px',
          borderRadius: '4px',
          border: '1px solid var(--border-glow)',
          background: 'transparent',
          color: 'var(--text-muted)',
          fontWeight: 500,
          fontSize: '13px',
          cursor: (!isDirty || saving) ? 'not-allowed' : 'pointer',
          opacity: (!isDirty || saving) ? 0.4 : 1,
        }}
      >
        Save
      </button>

      {/* Publish button */}
      {showPublishButton && (
        <button
          onClick={onPublish}
          disabled={saving}
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            border: '1px solid var(--accent-cyan)',
            background: 'rgba(0, 212, 255, 0.1)',
            color: 'var(--accent-cyan)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1,
            boxShadow: '0 0 12px rgba(0, 212, 255, 0.15)',
          }}
        >
          {hasPublished ? 'Re-publish' : 'Publish'}
        </button>
      )}
    </div>
  );
};
