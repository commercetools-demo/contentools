import { Modal, useModalState } from '@commercetools-demo/cms-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useHistory, useParams } from 'react-router-dom';
import PropertyEditor from '@commercetools-demo/cms-property-editor';
import styled from 'styled-components';
import { useStateContentItem } from '@commercetools-demo/cms-state';
import { ContentItem } from '@commercetools-demo/cms-types';

type Props = {
  locale?: string;
  baseURL: string;
  businessUnitKey: string;
};

const StyledColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentItemEditorCreateForm = ({
  baseURL,
  businessUnitKey,
  locale,
}: Props) => {
  const { contentTypeKey } = useParams<{
    contentTypeKey?: string;
  }>();
  const history = useHistory();

  const { createContentItem, fetchContentItems } = useStateContentItem();

  const hydratedUrl = baseURL + '/' + businessUnitKey;

  const contentItemEditorState = useModalState(true);

  const handleClose = () => {
    history.goBack();
    contentItemEditorState.closeModal();
  };

  const handleCreateContentItem = async (contentItem: ContentItem) => {
    await createContentItem(hydratedUrl, contentItem);
    await fetchContentItems(hydratedUrl);
    history.push(`/`);
    contentItemEditorState.closeModal();
  };

  if (!contentTypeKey) {
    return null;
  }

  return (
    <Modal
      isOpen={contentItemEditorState.isModalOpen}
      size={80}
      onClose={handleClose}
      title={`Create Content Item for ${contentTypeKey}`}
      topBarPreviousPathLabel="Content Items"
    >
      <Spacings.Stack>
        <div>
          <StyledRowDiv>
            <StyledColumnDiv>
              <PropertyEditor
                baseURL={baseURL}
                businessUnitKey={businessUnitKey}
                onComponentUpdated={(component) =>
                  handleCreateContentItem(component)
                }
                onComponentDeleted={() => {}}
                versionedContent={null}
                component={{
                  businessUnitKey,
                  type: contentTypeKey,
                  id: '',
                  key: '',
                  name: '',
                  properties: {},
                }}
              />
            </StyledColumnDiv>
            <StyledColumnDiv>
              <div className="content-item-edit-preview">
                <Spacings.Stack scale="m">
                  <Text.Subheadline as="h4">Content Preview</Text.Subheadline>
                  <Text.Body>
                    Previewing content item: {contentTypeKey}
                  </Text.Body>
                  <Text.Detail>Locale: {locale}</Text.Detail>
                  <Text.Detail>
                    This is a placeholder for the content preview component.
                    You'll need to implement the actual preview rendering based
                    on your content types.
                  </Text.Detail>
                </Spacings.Stack>
              </div>
            </StyledColumnDiv>
          </StyledRowDiv>
        </div>
      </Spacings.Stack>
    </Modal>
  );
};

export default ContentItemEditorCreateForm;
