import { ContentItem } from '@commercetools-demo/contentools-types';
import React, { PropsWithChildren } from 'react';
import ContextErrorBoundary from './components/context-error-boundary';
import ContextualRenderer from './components/contextual-renderer';
import StandaloneRenderer from './components/standalone-renderer';

export interface ContentItemRendererProps {
  /** The content item to render (required if itemKey is not provided) */
  component?: ContentItem;
  /** The key of the content item to fetch and render (required if component is not provided) */
  itemKey?: string;
  /** The query to fetch the content item from (required if itemKey and component is not provided) */
  query?: string;
  /** Whether to render the draft version of the content item */
  isDraft?: boolean;
  /** Base URL for API calls (optional) */
  baseURL?: string;
  /** The key of the business unit to fetch the content item from (optional) */
  businessUnitKey?: string;
  /** Locale for rendering (optional) */
  locale?: string;
  /** Additional CSS class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Show loading state */
  loading?: boolean;
  /** Custom error message */
  error?: string | null;
  /** Callback when component fails to render */
  onError?: (error: Error) => void;
}

/**
 * Main entry point for the content item renderer package.
 *
 * This component automatically detects whether a StateProvider context is available:
 * - If StateProvider context exists: renders ComponentRenderer directly with all props
 * - If StateProvider context is missing: wraps ComponentRenderer in StateProvider
 *
 * This ensures backward compatibility and ease of use for consumers.
 */
export const ContentItemRenderer: React.FC<
  PropsWithChildren<ContentItemRendererProps>
> = (props) => {
  return (
    <ContextErrorBoundary
      componentName="ContentItemRenderer"
      fallback={<StandaloneRenderer {...props} />}
    >
      <ContextualRenderer {...props} />
    </ContextErrorBoundary>
  );
};

// Export shared infrastructure for reuse by other renderer packages
export { ComponentCache } from './components/component-cache';
export { SecureDynamicComponentLoader } from './components/dynamic-component-loader';
export { DynamicComponentErrorBoundary } from './components/error-boundary';
export { default as ContextErrorBoundary } from './components/context-error-boundary';
export { createRenderers, createRenderer } from './components/renderer-factory';
export { default as ContextualRenderer } from './components/contextual-renderer';
export { default as StandaloneRenderer } from './components/standalone-renderer';

// Default export is the smart wrapper component
export default ContentItemRenderer;
