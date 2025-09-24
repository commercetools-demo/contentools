import {
  decodeFromBase64,
  useStateContentType,
} from '@commercetools-demo/contentools-state';
import React, {
  PropsWithChildren,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SecureDynamicComponentLoader } from './components/dynamic-component-loader';
import { DynamicComponentErrorBoundary } from './components/error-boundary';
import { ContentItemRendererProps } from '.';
import { ContentTypeData } from '@commercetools-demo/contentools-types';

/**
 * ComponentRenderer - Renders content items as React components
 *
 * This component takes a ContentItem and dynamically renders the appropriate
 * React component based on the content type. It replaces the previous web
 * component implementation with a pure React approach.
 */
const ComponentRenderer: React.FC<
  PropsWithChildren<
    Pick<
      ContentItemRendererProps,
      'baseURL' | 'component' | 'locale' | 'className' | 'style' | 'onError'
    >
  >
> = ({
  component,
  baseURL = '',
  locale = 'en-US',
  className,
  style,
  onError,
  children,
}) => {
  const { fetchContentType } = useStateContentType();
  const [Component, setComponent] = useState<any>(null);
  const [contentType, setContentType] = useState<ContentTypeData | null>(null);

  // Create loader instance with useMemo to prevent recreation
  const loader = useMemo(() => new SecureDynamicComponentLoader(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const properties = useMemo(() => {
    if (!contentType) return component?.properties;
    if (!contentType.metadata.propertySchema) return component?.properties;
    return Object.keys(contentType.metadata.propertySchema).reduce(
      (acc, key) => {
        if (!component?.properties[key]) return acc;
        if (contentType.metadata.propertySchema[key].type === 'richText') {
          acc[key] = decodeFromBase64(component?.properties[key]);
        } else {
          acc[key] = component?.properties[key];
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }, [contentType]);

  useEffect(() => {
    let mounted = true;

    async function loadComponent() {
      try {
        setLoading(true);
        setError(null);

        const contentType = await fetchContentType(component?.type || '');
        setContentType(contentType);

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

    if (component?.type) {
      loadComponent();
    }
    return () => {
      mounted = false;
    };
  }, [component?.type, fetchContentType, loader, onError]);

  useEffect(() => {
    return () => {
      loader.clearCache();
    };
  }, [loader]);

  if (loading) {
    return <Suspense fallback={null}></Suspense>;
  }

  if (error) {
    console.info(error);
    return children;
  }

  if (!Component) {
    console.info('Component not found');
    return children;
  }

  return (
    <div className={className} style={style}>
      <DynamicComponentErrorBoundary
        componentId={component?.id || ''}
        onError={onError}
      >
        <Suspense fallback={null}>
          <Component
            {...(component && properties)}
            locale={locale}
            baseURL={baseURL}
          />
        </Suspense>
      </DynamicComponentErrorBoundary>
    </div>
  );
};

// Default export
export default ComponentRenderer;
