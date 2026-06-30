import React from 'react';
import type { PuckStateInfo } from '@commercetools-demo/puck-types';
import { VersionHistoryButton } from '@commercetools-demo/puck-version-history';
import { Badge, Button, Stack } from '@commercetools/nimbus';

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
    <Stack direction="row" gap="200" alignItems="center">
      {/* Status badges */}
      <Stack direction="row" gap="100" alignItems="center">
        {saving && <Badge colorPalette="warning" size="xs">Saving…</Badge>}
        {!saving && isDirty && <Badge colorPalette="neutral" size="xs">Unsaved</Badge>}
        {!saving && !isDirty && hasDraft && <Badge colorPalette="info" size="xs">Draft</Badge>}
        {hasPublished && <Badge colorPalette="positive" size="xs">Published</Badge>}
      </Stack>

      {/* Revert button — only when there's a draft and an existing published version */}
      {hasDraft && hasPublished && (
        <Button variant="ghost" size="sm" onPress={onRevert} isDisabled={saving}>
          Revert to Published
        </Button>
      )}

      {/* Save draft button */}
      <Button variant="outline" size="sm" onPress={onSave} isDisabled={!isDirty || saving}>
        Save
      </Button>

      {/* Publish button */}
      {showPublishButton && (
        <Button variant="solid" size="sm" onPress={onPublish} isDisabled={saving}>
          {hasPublished ? 'Re-publish' : 'Publish'}
        </Button>
      )}

      {/* Version history toggle — self-contained, reads context */}
      <VersionHistoryButton disabled={saving} />
    </Stack>
  );
};
