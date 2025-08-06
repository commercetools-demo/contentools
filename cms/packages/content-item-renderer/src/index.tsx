import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ContentItem } from '@commercetools-demo/cms-types';
import { DynamicComponentErrorBoundary } from './components/error-boundary';
import { SecureDynamicComponentLoader } from './components/dynamic-component-loader';
import { useStateContentType } from '@commercetools-demo/cms-state';

export interface ComponentRendererProps {
  /** The content item to render */
  component: ContentItem;
  /** Base URL for API calls (optional) */
  baseURL?: string;
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
 * ComponentRenderer - Renders content items as React components
 *
 * This component takes a ContentItem and dynamically renders the appropriate
 * React component based on the content type. It replaces the previous web
 * component implementation with a pure React approach.
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  baseURL = '',
  locale = 'en-US',
  className,
  style,
  // loading = false,
  // error = null,
  onError,
}) => {

  const { fetchContentType } = useStateContentType();
  const [Component, setComponent] = useState<any>(null);

  // Create loader instance with useMemo to prevent recreation
  const loader = useMemo(() => new SecureDynamicComponentLoader(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadComponent() {
      try {
        setLoading(true);
        setError(null);

        const contentType = await fetchContentType(component.type);

        const loadedComponent = await loader.loadComponent({
          id: contentType.id,
          version: contentType.key,
          transpiledCode: contentType.code?.transpiledCode || '',
        });

        if (mounted) {
          setComponent(() => loadedComponent);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          if (onError) onError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadComponent();

    return () => {
      mounted = false;
    };
  }, [loader, onError]);
  useEffect(() => {
    return () => {
      loader.clearCache();
    };
  }, [loader]);

  if (loading) {
    return <Suspense fallback={<div>Loading...</div>}>Loading</Suspense>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#d63031',
        }}
      >
        <h3>Failed to Load Component</h3>
        <p>Component ID: {12}</p>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!Component) {
    return <div>Component not found</div>;
  }

  return (
    <DynamicComponentErrorBoundary componentId={component.id} onError={onError}>
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...component.properties} />
      </Suspense>
    </DynamicComponentErrorBoundary>
  );
};

// Default export
export default ComponentRenderer;
