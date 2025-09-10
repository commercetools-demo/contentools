import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from '@commercetools-demo/contentools-ui-components';
import { Page } from '@commercetools-demo/contentools-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Card from '@commercetools-uikit/card';
import { BinLinearIcon } from '@commercetools-uikit/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page | null;
  deletePage: (key: string) => Promise<void>;
  parentUrl: string;
}

const PageSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPage,
  deletePage,
  parentUrl,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const history = useHistory();

  const handleDeletePage = async () => {
    if (!currentPage) return;

    try {
      setIsDeleting(true);
      await deletePage(currentPage.key);

      // Navigate to parent URL after successful deletion
      history.push(`/`);
      onClose();
    } catch (error) {
      console.error('Failed to delete page:', error);
      // Handle error - could show a toast notification
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (!currentPage) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page Settings" size={30}>
      <Spacings.Stack scale="m">
        <Text.Body tone="secondary">
          Configure page properties and metadata
        </Text.Body>

        {/* Page Info Section */}
        <Card>
          <Spacings.Stack scale="s">
            <Text.Subheadline as="h4">Page Information</Text.Subheadline>
            <Spacings.Stack scale="xs">
              <div>
                <Text.Body>Page Name</Text.Body>
                <Text.Body>{currentPage.name}</Text.Body>
              </div>
              <div>
                <Text.Body>Route</Text.Body>
                <Text.Body>{currentPage.route}</Text.Body>
              </div>
              <div>
                <Text.Body>Page Key</Text.Body>
                <Text.Body tone="secondary">{currentPage.key}</Text.Body>
              </div>
            </Spacings.Stack>
          </Spacings.Stack>
        </Card>

        {/* Delete Section */}
        <Card>
          <Spacings.Stack scale="s">
            <Text.Subheadline as="h4" tone="critical">
              Danger Zone
            </Text.Subheadline>
            <Text.Body tone="secondary">
              Once you delete this page, there is no going back. Please be
              certain.
            </Text.Body>

            {!showDeleteConfirmation ? (
              <SecondaryButton
                label="Delete Page"
                iconLeft={<BinLinearIcon />}
                onClick={handleDeleteClick}
              />
            ) : (
              <Spacings.Stack scale="xs">
                <Text.Body tone="critical">
                  Are you sure you want to delete "{currentPage.name}"? This
                  action cannot be undone.
                </Text.Body>
                <Spacings.Inline scale="s">
                  <PrimaryButton
                    label={isDeleting ? 'Deleting...' : 'Yes, Delete Page'}
                    tone="critical"
                    onClick={handleDeletePage}
                    isDisabled={isDeleting}
                  />
                  <SecondaryButton
                    label="Cancel"
                    onClick={handleCancelDelete}
                    isDisabled={isDeleting}
                  />
                </Spacings.Inline>
              </Spacings.Stack>
            )}
          </Spacings.Stack>
        </Card>
      </Spacings.Stack>
    </Modal>
  );
};

export default PageSettingsModal;
