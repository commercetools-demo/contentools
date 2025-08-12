import { ContentItem } from '@commercetools-demo/cms-types';
import React from 'react';
import { ContentItemRenderer } from '@commercetools-demo/cms-content-item-renderer';
import styled from 'styled-components';

const StyledContentItemPreview = styled.div`
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

type Props = {
  item: ContentItem;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
};

const ContentItemPreview = ({
  item,
  baseURL,
  businessUnitKey,
  locale,
}: Props) => {
  const hydratedBaseUrl = `${baseURL}/${businessUnitKey}`;
  if (!item) {
    return null;
  }
  return (
    <StyledContentItemPreview>
      <ContentItemRenderer
        component={item}
        baseURL={hydratedBaseUrl}
        locale={locale}
      />
    </StyledContentItemPreview>
  );
};

export default ContentItemPreview;
