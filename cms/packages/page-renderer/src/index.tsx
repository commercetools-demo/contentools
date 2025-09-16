import { Page } from '@commercetools-demo/contentools-types';
import React, { PropsWithChildren } from 'react';
import { 
  ContextErrorBoundary, 
  createRenderers 
} from '@commercetools-demo/contentools-content-item-renderer';
import PageResolver from './components/page-resolver';

export interface PageRendererProps {
  /** The page to render (required if pageKey is not provided) */
  page?: Page;
  /** The key of the page to fetch and render (required if page is not provided) */
  pageKey?: string;
  /** The query to fetch the page from (required if pageKey and page is not provided) */
  query?: string;
  /** Whether to render the draft version of the page */
  isDraft?: boolean;
  /** Base URL for API calls (optional) */
  baseURL?: string;
  /** The key of the business unit to fetch the page from (optional) */
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
  /** Callback when page fails to render */
  onError?: (error: Error) => void;
}

// Create the contextual and standalone renderers using the factory
const { ContextualRenderer, StandaloneRenderer } = createRenderers(PageResolver);

/**
 * Main entry point for the page renderer package.
 *
 * This component renders a complete page with its layout grid and components.
 * It automatically detects whether a StateProvider context is available:
 * - If StateProvider context exists: renders PageResolver directly with all props
 * - If StateProvider context is missing: wraps PageResolver in StateProvider
 *
 * This ensures backward compatibility and ease of use for consumers.
 */
export const PageRenderer: React.FC<PropsWithChildren<PageRendererProps>> = (
  props
) => {
  return (
    <ContextErrorBoundary 
      componentName="PageRenderer"
      fallback={<StandaloneRenderer {...props} />}
    >
      <ContextualRenderer {...props} />
    </ContextErrorBoundary>
  );
};

// Default export is the smart wrapper component
export default PageRenderer;
