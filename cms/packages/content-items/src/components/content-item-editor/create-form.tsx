import PropertyEditor from '@commercetools-demo/contentools-property-editor';
import {
  useStateContentItem,
  useStateContentType,
} from '@commercetools-demo/contentools-state';
import { ContentItem } from '@commercetools-demo/contentools-types';
import { Modal, useModalState } from '@commercetools-demo/contentools-ui-components';
import Spacings from '@commercetools-uikit/spacings';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PropertyEditorPreview from '../property-editor-preview';

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
  const { contentTypes } = useStateContentType();
  const [item, setItem] = useState<ContentItem | null>({
    businessUnitKey,
    type: contentTypeKey || '',
    id: '',
    key: '',
    name: '',
    properties: {},
  });

  const contentType = contentTypes.find((ct) => ct.key === contentTypeKey);

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

  if (!contentTypeKey || !item) {
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
                onChange={(component) => setItem(component)}
                onComponentUpdated={(component) =>
                  handleCreateContentItem(component)
                }
                onComponentDeleted={() => {}}
                versionedContent={null}
                component={item}
              />
            </StyledColumnDiv>
            <StyledColumnDiv>
              <PropertyEditorPreview
                item={item}
                baseURL={baseURL}
                businessUnitKey={businessUnitKey}
                locale={locale || 'en-US'}
              />
            </StyledColumnDiv>
          </StyledRowDiv>
        </div>
      </Spacings.Stack>
    </Modal>
  );
};

export default ContentItemEditorCreateForm;
