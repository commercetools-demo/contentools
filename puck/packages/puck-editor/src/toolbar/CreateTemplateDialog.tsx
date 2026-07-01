import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  FormField,
  Stack,
  Text,
  TextInput,
} from '@commercetools/nimbus';

export interface CreateTemplateDialogProps {
  /** Whether the dialog is visible. */
  isOpen: boolean;
  /** Called when the dialog requests to open/close (backdrop, Esc, Cancel). */
  onOpenChange: (isOpen: boolean) => void;
  /**
   * Called when the user confirms. `withoutData` reflects the
   * "Create template without data" checkbox (default checked).
   */
  onConfirm: (name: string, withoutData: boolean) => void | Promise<void>;
  /** Disables the form while the template is being created. */
  saving?: boolean;
}

/**
 * Nimbus dialog for "Create a template from this page/content". Collects a
 * template name and whether to strip component data before saving.
 */
export const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  saving = false,
}) => {
  const [name, setName] = useState('');
  const [withoutData, setWithoutData] = useState(true);
  const [error, setError] = useState('');

  // Reset the form each time the dialog opens.
  useEffect(() => {
    if (isOpen) {
      setName('');
      setWithoutData(true);
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    void onConfirm(name.trim(), withoutData);
  };

  return (
    <Dialog.Root isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create a new template</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Stack direction="column" gap="400">
            <FormField.Root isRequired>
              <FormField.Label>Name</FormField.Label>
              <FormField.Input>
                <TextInput
                  value={name}
                  onChange={(v) => setName(v)}
                  placeholder="e.g. Landing page"
                  autoFocus
                />
              </FormField.Input>
            </FormField.Root>
            <Checkbox
              isSelected={withoutData}
              onChange={(selected) => setWithoutData(selected)}
              isDisabled={saving}
            >
              Create template without data
            </Checkbox>
            {error && <Text color="critical.11">{error}</Text>}
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button slot="close" variant="outline" isDisabled={saving}>
            Cancel
          </Button>
          <Button variant="solid" onPress={handleConfirm} isDisabled={saving}>
            {saving ? 'Creating…' : 'Create'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
