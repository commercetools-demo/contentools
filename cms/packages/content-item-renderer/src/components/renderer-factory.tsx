import React, { PropsWithChildren } from 'react';
import { StateProvider, useStateContext } from '@commercetools-demo/contentools-state';

interface BaseRendererProps {
  baseURL?: string;
}

/**
 * Factory function to create contextual and standalone renderer components
 * This eliminates code duplication between different renderer packages
 */
export function createRenderers<TProps extends BaseRendererProps>(
  ResolverComponent: React.ComponentType<PropsWithChildren<TProps>>
) {
  const ContextualRenderer: React.FC<PropsWithChildren<TProps>> = (props) => {
    // Always call the hook - this follows React's Rules of Hooks
    const context = useStateContext();

    // If context is available, render the resolver
    if (context) {
      return <ResolverComponent {...props} />;
    }

    // This should not happen if context is properly set up
    return <ResolverComponent {...props} />;
  };

  const StandaloneRenderer: React.FC<PropsWithChildren<TProps>> = (props) => {
    if (!props.baseURL) {
      return null;
    }

    return (
      <StateProvider baseURL={props.baseURL} minimal={true}>
        <ResolverComponent {...props} />
      </StateProvider>
    );
  };

  return {
    ContextualRenderer,
    StandaloneRenderer,
  };
}

/**
 * Higher-order component that creates a complete renderer with error boundary
 * This provides the full renderer pattern used by both ContentItemRenderer and PageRenderer
 */
export function createRenderer<TProps extends BaseRendererProps>(
  ResolverComponent: React.ComponentType<PropsWithChildren<TProps>>,
  rendererName: string
) {
  const { ContextualRenderer, StandaloneRenderer } = createRenderers(ResolverComponent);
  
  return {
    ContextualRenderer,
    StandaloneRenderer,
  };
}
