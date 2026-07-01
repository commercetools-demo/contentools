import React from 'react';
import type { PuckStateInfo } from '@commercetools-demo/puck-types';
import { usePuck } from '@measured/puck';
import { useVersionHistoryContext } from '@commercetools-demo/puck-version-history';
import {
  Badge,
  Button,
  Icon,
  IconButton,
  Menu,
  Stack,
  Text,
} from '@commercetools/nimbus';
import {
  History,
  MoreVert,
  PostAdd,
  Redo,
  SettingsBackupRestore,
  Tune,
  Undo,
  Category,
  Visibility,
} from '@commercetools/nimbus-icons';

export interface EditorToolbarProps {
  /** Page / content name shown centred in the bar. */
  title: string;
  saving: boolean;
  isDirty: boolean;
  states: PuckStateInfo;
  onSave: () => void;
  onPublish: () => void;
  onRevert: () => void;
  /** When provided, renders a Preview button that opens the preview view. */
  onPreview?: () => void;
  /** When provided, adds a "Create a template from this…" overflow-menu item. */
  onCreateTemplate?: () => void;
  /** Label for the create-template menu item. */
  createTemplateLabel?: string;
  showPublishButton: boolean;
}

/**
 * Full replacement for Puck's header (wired via the `header` override).
 *
 * Layout: undo/redo + panel toggle on the left, the document name with its
 * status badges centred, and the Save / Publish / Preview actions plus an
 * overflow menu (version history, revert) on the right.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  title,
  saving,
  isDirty,
  states,
  onSave,
  onPublish,
  onRevert,
  onPreview,
  onCreateTemplate,
  createTemplateLabel = 'Create a template from this page',
  showPublishButton,
}) => {
  const { dispatch, appState, history } = usePuck();
  const { isHistoryTabActive, openHistoryTab, closeHistoryTab } =
    useVersionHistoryContext();

  const hasDraft = Boolean(states.draft);
  const hasPublished = Boolean(states.published);
  const canRevert = hasDraft && hasPublished;

  const toggleHistory = () =>
    isHistoryTabActive ? closeHistoryTab() : openHistoryTab();

  const toggleLeftPanel = () =>
    dispatch({
      type: 'setUi',
      ui: { leftSideBarVisible: !appState.ui.leftSideBarVisible },
    });

  const toggleRightPanel = () =>
    dispatch({
      type: 'setUi',
      ui: { rightSideBarVisible: !appState.ui.rightSideBarVisible },
    });

  return (
    <div
      style={{
        // Claim the "header" cell of Puck's PuckLayout-inner grid — the default
        // <header> gets this via a CSS class we no longer render.
        gridArea: 'header',
        background: 'var(--puck-color-white, #fff)',
        borderBottom: '1px solid var(--puck-color-grey-09, #e2e2e2)',
        padding: '8px 12px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* LEFT — panel toggle + undo / redo */}
        <Stack direction="row" gap="100" alignItems="center" justifyContent="flex-start">
          <IconButton
            aria-label="Toggle components panel"
            variant="ghost"
            size="xs"
            onPress={toggleLeftPanel}
          >
            <Category />
          </IconButton>
          <IconButton
            aria-label="Toggle properties panel"
            variant="ghost"
            size="xs"
            onPress={toggleRightPanel}
          >
            <Tune />
          </IconButton>
          <IconButton
            aria-label="Undo"
            variant="ghost"
            size="xs"
            isDisabled={!history.hasPast}
            onPress={() => history.back()}
          >
            <Undo />
          </IconButton>
          <IconButton
            aria-label="Redo"
            variant="ghost"
            size="xs"
            isDisabled={!history.hasFuture}
            onPress={() => history.forward()}
          >
            <Redo />
          </IconButton>
        </Stack>

        {/* CENTER — document name + status badges */}
        <Stack direction="row" gap="200" alignItems="center" justifyContent="center">
          <Text fontWeight="700" truncate>
            {title}
          </Text>
          <Stack direction="row" gap="100" alignItems="center">
            {saving && (
              <Badge colorPalette="warning" size="xs">
                Saving…
              </Badge>
            )}
            {!saving && isDirty && (
              <Badge colorPalette="neutral" size="xs">
                Unsaved
              </Badge>
            )}
            {!saving && !isDirty && hasDraft && (
              <Badge colorPalette="info" size="xs">
                Draft
              </Badge>
            )}
            {hasPublished && (
              <Badge colorPalette="positive" size="xs">
                Published
              </Badge>
            )}
          </Stack>
        </Stack>

        {/* RIGHT — preview / save / publish + overflow menu */}
        <Stack direction="row" gap="200" alignItems="center" justifyContent="flex-end">
          {onPreview && (
            <Button variant="ghost" size="xs" onPress={onPreview} isDisabled={saving}>
              <Icon as={Visibility} /> Preview
            </Button>
          )}
          <Button
            variant="outline"
            size="xs"
            onPress={onSave}
            isDisabled={!isDirty || saving}
          >
            Save
          </Button>
          {showPublishButton && (
            <Button variant="solid" size="xs" onPress={onPublish} isDisabled={saving}>
              Publish
            </Button>
          )}
          <Menu.Root
            onAction={(key) => {
              if (key === 'history') toggleHistory();
              else if (key === 'revert') onRevert();
              else if (key === 'create-template') onCreateTemplate?.();
            }}
          >
            <Menu.Trigger asChild>
              <IconButton
                aria-label="More options"
                variant="ghost"
                size="xs"
                isDisabled={saving}
              >
                <MoreVert />
              </IconButton>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="history">
                <Icon slot="icon">
                  <History />
                </Icon>
                <Text slot="label">
                  {isHistoryTabActive ? 'Hide version history' : 'Version history'}
                </Text>
              </Menu.Item>
              {canRevert && (
                <Menu.Item id="revert">
                  <Icon slot="icon">
                    <SettingsBackupRestore />
                  </Icon>
                  <Text slot="label">Revert to published</Text>
                </Menu.Item>
              )}
              {onCreateTemplate && (
                <Menu.Item id="create-template">
                  <Icon slot="icon">
                    <PostAdd />
                  </Icon>
                  <Text slot="label">{createTemplateLabel}</Text>
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu.Root>
        </Stack>
      </div>
    </div>
  );
};
