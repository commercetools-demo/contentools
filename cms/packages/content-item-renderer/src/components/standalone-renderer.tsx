import React, { PropsWithChildren } from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import { ContentItemRendererProps } from '..';
import ContentItemResolver from './content-item-resolver';

const StandaloneRenderer: React.FC<
  PropsWithChildren<ContentItemRendererProps>
> = (props) => {
  if (!props.baseURL) {
    return null;
  }

  return (
    <StateProvider baseURL={props.baseURL} minimal={true}>
      <ContentItemResolver {...props} />
    </StateProvider>
  );
};

export default StandaloneRenderer;
