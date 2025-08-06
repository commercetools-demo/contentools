import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { useStateVersion } from '@commercetools-demo/cms-state';
import { ContentItemVersionInfo } from '@commercetools-demo/cms-types';
import { Modal } from '@commercetools-demo/cms-ui-components';

interface VersionHistorySidebarProps {
  isVisible: boolean;
  selectedVersionId: string | null;
  onVersionSelected: (versionId: string) => void;
  onApplyVersion: (versionId: string) => void;
  onSelectionCancelled: () => void;
  onClose: () => void;
}

const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  isVisible,
  selectedVersionId,
  onVersionSelected,
  onApplyVersion,
  onSelectionCancelled,
  onClose,
}) => {
  const { versions } = useStateVersion<ContentItemVersionInfo>()


  return (
    <Modal
      isOpen={isVisible}
      size={15}
      onClose={onClose}
      title="Version History"
    >
      <Spacings.Stack scale="m">
        {versions.length === 0 ? (
          <Text.Body>No version history available</Text.Body>
        ) : (
          <Spacings.Stack scale="s">
            {versions.map((version) => (
              <Card 
                key={version.id}
                type={selectedVersionId === version.id ? 'raised' : 'flat'}
                onClick={() => onVersionSelected(version.id)}
              >
                <Spacings.Stack scale="xs">
                  {/* <Text.Detail>Version {version.version}</Text.Detail> */}
                  <Text.Caption>{new Date(version.timestamp).toLocaleDateString()}</Text.Caption>
                  {/* {version.createdBy && (
                    <Text.Caption>by {version.createdBy}</Text.Caption>
                  )} */}
                </Spacings.Stack>
              </Card>
            ))}
          </Spacings.Stack>
        )}
        
        {selectedVersionId && (
          <Spacings.Inline scale="s" alignItems="flex-end" justifyContent="space-evenly">
            <PrimaryButton
              label="Apply Version"
              size='medium'
              onClick={() => onApplyVersion(selectedVersionId)}
            />
            <SecondaryButton
              label="Cancel"
              size='medium'
              onClick={onSelectionCancelled}
            />
          </Spacings.Inline>
        )}
      </Spacings.Stack>
    </Modal>
  );
};

export default VersionHistorySidebar; 