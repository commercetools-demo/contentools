import React, { PropsWithChildren } from 'react';
import { useStateContext } from '@commercetools-demo/contentools-state';
import { PageRendererProps } from '..';
import PageResolver from './page-resolver';

const ContextualRenderer: React.FC<
  PropsWithChildren<PageRendererProps>
> = (props) => {
  // Always call the hook - this follows React's Rules of Hooks
  const context = useStateContext();

  // If context is available, render the resolver
  if (context) {
    return <PageResolver {...props} />;
  }

  // This should not happen if context is properly set up
  return <PageResolver {...props} />;
};

export default ContextualRenderer;
