import React from 'react';
import { Button, Dialog, Stack, Text } from '@commercetools/nimbus';

export interface UnsavedChangesDialogProps {
  /** Whether the dialog is visible. */
  isOpen: boolean;
  /** Called when the dialog requests to open/close (backdrop, Esc, Stay). */
  onOpenChange: (isOpen: boolean) => void;
  /** Called when the user confirms they want to leave and discard changes. */
  onConfirm: () => void;
}

/**
 * Nimbus confirmation shown when the user tries to navigate away from an editor
 * that has unsaved changes. Replaces the native `window.confirm` so the warning
 * matches the rest of the editor chrome.
 */
export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
}) => (
  <Dialog.Root isOpen={isOpen} onOpenChange={onOpenChange}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Discard unsaved changes?</Dialog.Title>
        <Dialog.CloseTrigger />
      </Dialog.Header>
      <Dialog.Body>
        <Stack direction="column" gap="200">
          <Text>
            You have unsaved changes on this page. If you leave now, those
            changes will be lost.
          </Text>
        </Stack>
      </Dialog.Body>
      <Dialog.Footer>
        <Button slot="close" variant="outline">
          Stay on page
        </Button>
        <Button
          colorPalette="critical"
          onPress={() => {
            onOpenChange(false);
            onConfirm();
          }}
        >
          Leave &amp; discard
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);
