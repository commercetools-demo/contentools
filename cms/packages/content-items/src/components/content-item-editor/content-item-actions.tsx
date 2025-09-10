import {
  ContentItem,
  EStateType,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import {
  StateTag,
  getStateType,
} from '@commercetools-demo/contentools-ui-components';
import IconButton from '@commercetools-uikit/icon-button';
import { ClockIcon, ListWithSearchIcon } from '@commercetools-uikit/icons';
import PrimaryActionDropdown, {
  Option,
} from '@commercetools-uikit/primary-action-dropdown';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import React from 'react';

interface ContentItemActionsProps {
  showVersionHistory: boolean;
  onToggleVersionHistory: () => void;
  currentState: StateInfo<ContentItem> | null;
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
  const stateType = getStateType(currentState);

  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Spacings.Inline alignItems="center" justifyContent="space-between">
          {currentState && <StateTag status={currentState} />}

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
                stateType !== EStateType.PUBLISHED &&
                stateType !== EStateType.BOTH
              }
              onClick={() => onViewJson(false)}
            >
              Published
            </Option>
          </PrimaryActionDropdown>

          <Spacings.Inline>
            {(stateType === EStateType.DRAFT ||
              stateType === EStateType.BOTH) && (
              <SecondaryButton
                size="20"
                label="Revert to Published"
                onClick={onRevert}
              />
            )}

            {stateType !== EStateType.PUBLISHED && (
              <PrimaryButton size="20" label="Publish" onClick={onPublish} />
            )}
          </Spacings.Inline>
        </Spacings.Inline>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default ContentItemActions;
