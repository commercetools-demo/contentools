import { useStateContentType } from '@commercetools-demo/cms-state';
import { ContentItem } from '@commercetools-demo/cms-types';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { SecureDynamicComponentLoader } from './components/dynamic-component-loader';
import { DynamicComponentErrorBoundary } from './components/error-boundary';

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
const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  baseURL = '',
  locale = 'en-US',
  className,
  style,
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
  }, [component.type, fetchContentType, loader, onError]);
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
        <p>Component ID: {component.id}</p>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!Component) {
    return <div>Component not found</div>;
  }

  return (
    <div className={className} style={style}>
      <DynamicComponentErrorBoundary componentId={component.id} onError={onError}>
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...component.properties} locale={locale} baseURL={baseURL} />
        </Suspense>
      </DynamicComponentErrorBoundary>
    </div>
  );
};

// Default export
export default ComponentRenderer;
