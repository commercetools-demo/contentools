import React, { PropsWithChildren } from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import { PageRendererProps } from '..';
import PageResolver from './page-resolver';

const StandaloneRenderer: React.FC<
  PropsWithChildren<PageRendererProps>
> = (props) => {
  if (!props.baseURL) {
    return null;
  }

  return (
    <StateProvider baseURL={props.baseURL} minimal={true}>
      <PageResolver {...props} />
    </StateProvider>
  );
};

export default StandaloneRenderer;
