import {
  EStateType,
  Page,
  StateInfo,
} from '@commercetools-demo/contentools-types';
import {
  getStateType,
  StateTag,
} from '@commercetools-demo/contentools-ui-components';
import IconButton from '@commercetools-uikit/icon-button';
import {
  ClockIcon,
  EyeIcon,
  GearIcon,
  GridIcon,
  ListWithSearchIcon,
  SubdirectoryArrowIcon,
} from '@commercetools-uikit/icons';
import PrimaryActionDropdown, {
  Option,
} from '@commercetools-uikit/primary-action-dropdown';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import React from 'react';

interface PageGridActionsProps {
  showVersionHistory: boolean;
  onToggleVersionHistory: () => void;
  onTogglePageSettings: () => void;
  onTogglePageLibrary: () => void;
  onAddRow: () => void;
  currentState: StateInfo<Page> | null;
  onViewJson: (isPreview: boolean) => void;
  onRevert: () => void;
  onPublish: () => void;
  onTogglePagePreview: () => void;
}

const PageGridActions: React.FC<PageGridActionsProps> = ({
  showVersionHistory,
  onToggleVersionHistory,
  onTogglePageSettings,
  onTogglePageLibrary,
  onAddRow,
  currentState,
  onViewJson,
  onRevert,
  onPublish,
  onTogglePagePreview,
}) => {
  const pageStateType = getStateType(currentState);

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
          <IconButton
            size="30"
            label="Page Settings"
            onClick={onTogglePageSettings}
            icon={<GearIcon />}
          />
          <IconButton
            size="30"
            label="Page Library"
            onClick={onTogglePageLibrary}
            icon={<GridIcon />}
          />
          <IconButton
            size="30"
            label="Add Row"
            onClick={onAddRow}
            icon={<SubdirectoryArrowIcon />}
          />
          <IconButton
            size="30"
            label="Page Preview"
            onClick={onTogglePagePreview}
            icon={<EyeIcon />}
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
                pageStateType !== EStateType.PUBLISHED &&
                pageStateType !== EStateType.BOTH
              }
              onClick={() => onViewJson(false)}
            >
              Published
            </Option>
          </PrimaryActionDropdown>

          <Spacings.Inline>
            {(pageStateType === EStateType.DRAFT ||
              pageStateType === EStateType.BOTH) && (
              <SecondaryButton
                size="20"
                label="Revert to Published"
                onClick={onRevert}
              />
            )}

            {pageStateType !== EStateType.PUBLISHED && (
              <PrimaryButton size="20" label="Publish" onClick={onPublish} />
            )}
          </Spacings.Inline>
        </Spacings.Inline>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default PageGridActions;
