import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import Stamp from '@commercetools-uikit/stamp';

interface ContentItemActionsProps {
  showVersionHistory: boolean;
  onToggleVersionHistory: () => void;
  currentState: 'draft' | 'published' | 'both' | null;
  onViewJson: (isPreview: boolean) => void;
  onRevert: () => void;
  onPublish: () => void;
}

const ContentItemActions: React.FC<ContentItemActionsProps> = ({
  showVersionHistory,
  onToggleVersionHistory,
  currentState,
  onViewJson,
  onRevert,
  onPublish,
}) => {
  const getStampTone = () => {
    switch (currentState) {
      case 'draft':
        return 'information';
      case 'published':
        return 'positive';
      case 'both':
        return 'warning';
      default:
        return 'information';
    }
  };

  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="flex-end">
        <SecondaryButton
          size="10"
          label={showVersionHistory ? 'Hide History' : 'Show History'}
          onClick={onToggleVersionHistory}
        />

        {(currentState === 'published' || currentState === 'both') && (
          <SecondaryButton
            size="10"
            iconLeft={<ExternalLinkIcon />}
            label="View Published JSON"
            onClick={() => onViewJson(false)}
          />
        )}

        <SecondaryButton
          size="10"
          iconLeft={<ExternalLinkIcon />}
          label="View Draft JSON"
          onClick={() => onViewJson(true)}
        />

        {currentState && <Stamp tone={getStampTone()}>{currentState}</Stamp>}

        <Spacings.Inline>
          {(currentState === 'draft' || currentState === 'both') && (
            <SecondaryButton
              size="10"
              label="Revert to Published"
              onClick={onRevert}
            />
          )}

          {currentState !== 'published' && (
            <PrimaryButton size="10" label="Publish" onClick={onPublish} />
          )}
        </Spacings.Inline>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default ContentItemActions;
