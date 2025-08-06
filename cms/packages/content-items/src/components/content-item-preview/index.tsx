import { ContentItem } from '@commercetools-demo/cms-types';
// import { ComponentRenderer } from '@commercetools-demo/cms-content-item-renderer';
import React from 'react';
import { ComponentRenderer } from '@commercetools-demo/cms-content-item-renderer';
// import { ComponentPlayground } from '@commercetools-demo/cms-content-type-editor';

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
    <ComponentRenderer
      component={item}
      baseURL={hydratedBaseUrl}
      locale={locale}
      
    />
  );
};

export default ContentItemPreview;
