import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import IconButton from '@commercetools-uikit/icon-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { ExternalLinkIcon, ClockIcon, ListWithSearchIcon } from '@commercetools-uikit/icons';
import Stamp from '@commercetools-uikit/stamp';
import PrimaryActionDropdown, {
  Option,
} from '@commercetools-uikit/primary-action-dropdown';
import styled from 'styled-components';

const StyledStamp = styled.span`
  text-transform: capitalize;
`;

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
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Spacings.Inline alignItems="center" justifyContent="space-between">
          {currentState && (
            <Stamp tone={getStampTone()}>
              <StyledStamp>{currentState}</StyledStamp>
            </Stamp>
          )}

          <IconButton
            size="30"
            label={showVersionHistory ? 'Hide History' : 'Show History'}
            onClick={onToggleVersionHistory}
            icon={<ClockIcon />}
          />
        </Spacings.Inline>

        <Spacings.Inline alignItems="center" justifyContent="flex-end">
          <PrimaryActionDropdown>
            <Option
              iconLeft={<ListWithSearchIcon />}
              onClick={() => onViewJson(true)}
            >
              Draft
            </Option>
            <Option
              iconLeft={<ListWithSearchIcon />}
              isDisabled={
                currentState !== 'published' && currentState !== 'both'
              }
              onClick={() => onViewJson(false)}
            >
              Published
            </Option>
          </PrimaryActionDropdown>

          <Spacings.Inline>
            {(currentState === 'draft' || currentState === 'both') && (
              <SecondaryButton
                size="20"
                label="Revert to Published"
                onClick={onRevert}
              />
            )}

            {currentState !== 'published' && (
              <PrimaryButton size="20" label="Publish" onClick={onPublish} />
            )}
          </Spacings.Inline>
        </Spacings.Inline>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default ContentItemActions;
