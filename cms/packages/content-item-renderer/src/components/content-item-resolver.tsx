import { useStateContentItem } from '@commercetools-demo/contentools-state';
import { ContentItemRendererProps } from '..';
import { ContentItem } from '@commercetools-demo/contentools-types';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import ComponentRenderer from '../content-renderer';

const ContentItemResolver: React.FC<
  PropsWithChildren<ContentItemRendererProps>
> = (props) => {
  const {
    isDraft,
    component,
    itemKey,
    query,
    baseURL,
    businessUnitKey,
    onError,
    ...otherProps
  } = props;
  const [resolvedComponent, setResolvedComponent] =
    useState<ContentItem | null>(component || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    fetchPublishedContentItem,
    fetchContentItem,
    queryContentItem,
    queryPublishedContentItem,
  } = useStateContentItem();

  const hydratedUrl = useMemo(() => {
    return baseURL + '/' + businessUnitKey;
  }, [baseURL, businessUnitKey]);

  // Validate props
  if (!component && !itemKey && !query) {
    throw new Error(
      'ContentItemRenderer requires either component or itemKey or query prop'
    );
  }

  if (component && itemKey && query) {
    console.warn(
      'ContentItemRenderer: Both component and itemKey and query provided. Using component prop.'
    );
  }

  // Effect to fetch content item by itemKey if needed
  useEffect(() => {
    if (component) {
      // If component is provided directly, use it
      setResolvedComponent(component);
      return;
    } else if (!component && itemKey && baseURL) {
      let mounted = true;

      async function fetchContentItemByKey() {
        try {
          setLoading(true);
          setError(null);

          if (!baseURL) {
            throw new Error('BaseURL is required to fetch content item');
          }
          const fetchedItem = isDraft
            ? await fetchContentItem(hydratedUrl, itemKey!)
            : await fetchPublishedContentItem(hydratedUrl, itemKey!);

          if (mounted) {
            setResolvedComponent(fetchedItem);
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

      fetchContentItemByKey();

      return () => {
        mounted = false;
      };
    } else if (!component && !itemKey && query && baseURL) {
      let mounted = true;

      async function fetchContentItemByQuery() {
        try {
          setLoading(true);
          setError(null);

          if (!baseURL) {
            throw new Error('BaseURL is required to fetch content item');
          }
          const fetchedItem = isDraft
            ? await queryContentItem(hydratedUrl, query!)
            : await queryPublishedContentItem(hydratedUrl, query!);

          if (mounted) {
            setResolvedComponent(fetchedItem);
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

      fetchContentItemByQuery();

      return () => {
        mounted = false;
      };
    }

    return undefined; // Return undefined for all other cases
  }, [component, itemKey, baseURL, hydratedUrl, onError]);

  // Show loading state while fetching
  if (loading) {
    return null;
  }

  // Show error state if fetch failed
  if (error) {
    console.error('Error:', error);
    return null;
  }

  // If no resolved component, show error
  if (!resolvedComponent) {
    console.error('Resolved component is null');
    return null;
  }

  // Render the actual ComponentRenderer with the resolved component
  return (
    <ComponentRenderer
      component={resolvedComponent}
      baseURL={baseURL}
      {...otherProps}
    />
  );
};

export default ContentItemResolver;
