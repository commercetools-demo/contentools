import {
  useStateContentItem,
} from '@commercetools-demo/cms-state';
import { ContentItemRendererProps } from '..';
import { ContentItem } from '@commercetools-demo/cms-types';
import { useEffect, useState } from 'react';
import ComponentRenderer from '../content-renderer';

const ContentItemResolver: React.FC<ContentItemRendererProps> = (props) => {
  const {
    isDraft,
    component,
    itemKey,
    baseURL,
    businessUnitKey,
    onError,
    ...otherProps
  } = props;
  const [resolvedComponent, setResolvedComponent] =
    useState<ContentItem | null>(component || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchPublishedContentItem, fetchContentItem } = useStateContentItem();

  const hydratedUrl = baseURL + '/' + businessUnitKey;

  // Validate props
  if (!component && !itemKey) {
    throw new Error(
      'ContentItemRenderer requires either component or itemKey prop'
    );
  }

  if (component && itemKey) {
    console.warn(
      'ContentItemRenderer: Both component and itemKey provided. Using component prop.'
    );
  }

  // Effect to fetch content item by itemKey if needed
  useEffect(() => {
    if (!component && itemKey && baseURL) {
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
    } else if (component) {
      // If component is provided directly, use it
      setResolvedComponent(component);
      return; // No cleanup needed
    }

    return undefined; // Return undefined for all other cases
  }, [component, itemKey, baseURL, onError]);

  // Show loading state while fetching
  if (loading) {
    return <div>Loading content item...</div>;
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
