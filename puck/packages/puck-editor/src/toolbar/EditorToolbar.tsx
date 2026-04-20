import React from 'react';
import type { PuckStateInfo } from '@commercetools-demo/puck-types';
import { VersionHistoryButton } from '@commercetools-demo/puck-version-history';
import Stamp from '@commercetools-uikit/stamp';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';

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
    <Spacings.Inline scale="s" alignItems="center">
      {/* Status stamps */}
      <Spacings.Inline scale="xs" alignItems="center">
        {saving && <Stamp tone="warning" label="Saving…" isCondensed />}
        {!saving && isDirty && <Stamp tone="secondary" label="Unsaved" isCondensed />}
        {!saving && !isDirty && hasDraft && <Stamp tone="information" label="Draft" isCondensed />}
        {hasPublished && <Stamp tone="positive" label="Published" isCondensed />}
      </Spacings.Inline>

      {/* Revert button — only when there's a draft and an existing published version */}
      {hasDraft && hasPublished && (
        <FlatButton
          label="Revert to Published"
          onClick={onRevert}
          isDisabled={saving}
        />
      )}

      {/* Save draft button */}
      <SecondaryButton
        label="Save"
        onClick={onSave}
        isDisabled={!isDirty || saving}
      />

      {/* Publish button */}
      {showPublishButton && (
        <PrimaryButton
          label={hasPublished ? 'Re-publish' : 'Publish'}
          onClick={onPublish}
          isDisabled={saving}
        />
      )}

      {/* Version history toggle — self-contained, reads context */}
      <VersionHistoryButton disabled={saving} />
    </Spacings.Inline>
  );
};
