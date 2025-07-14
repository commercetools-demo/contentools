import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useParams } from 'react-router-dom';
type Props = {
  locale?: string;
  baseURL?: string;
  businessUnitKey?: string;
};

const ContentItemEditorCreateForm = ({
  baseURL,
  businessUnitKey,
  locale,
}: Props) => {
  const { contentTypeKey } = useParams<{
    contentTypeKey?: string;
  }>();
  const hydratedUrl = baseURL + '/' + businessUnitKey;

  const contentItemEditorState = useModalState(true);

  const handleClose = () => {
    contentItemEditorState.closeModal();
  };


  return (
    <Modal
      isOpen={contentItemEditorState.isModalOpen}
      size={80}
      onClose={handleClose}
      title={`Create Content Item for ${contentTypeKey}`}
      topBarPreviousPathLabel="Content Items"
    >
      <Spacings.Stack>
        

        <div
          
        >
          <div className="content-item-edit">
            <div className="content-item-edit-editor">
              <Spacings.Stack scale="m">
                <Text.Subheadline as="h4">Edit Content Item</Text.Subheadline>
                <Text.Body>Content item: {contentTypeKey}</Text.Body>
                <Text.Detail>
                  This is a placeholder for the property editor component.
                  You'll need to implement the actual editing interface based on
                  your content type schemas.
                </Text.Detail>
              </Spacings.Stack>
            </div>

            <div className="content-item-edit-preview">
              <Spacings.Stack scale="m">
                <Text.Subheadline as="h4">Content Preview</Text.Subheadline>
                <Text.Body>Previewing content item: {contentTypeKey}</Text.Body>
                <Text.Detail>Locale: {locale}</Text.Detail>
                <Text.Detail>
                  This is a placeholder for the content preview component.
                  You'll need to implement the actual preview rendering based on
                  your content types.
                </Text.Detail>
              </Spacings.Stack>
            </div>
          </div>
        </div>
      </Spacings.Stack>
    </Modal>
  );
};

export default ContentItemEditorCreateForm;
