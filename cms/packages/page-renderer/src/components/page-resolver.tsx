import { useStatePages } from '@commercetools-demo/contentools-state';
import { PageRendererProps } from '..';
import { Page } from '@commercetools-demo/contentools-types';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PageGridRenderer from '../page-renderer';

const PageResolver: React.FC<
  PropsWithChildren<PageRendererProps>
> = (props) => {
  const {
    isDraft,
    page,
    pageKey,
    query,
    baseURL,
    businessUnitKey,
    onError,
    ...otherProps
  } = props;
  const [resolvedPage, setResolvedPage] =
    useState<Page | null>(page || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchPage, fetchPublishedPage, queryPage, queryPublishedPage } = useStatePages();

  const hydratedUrl = useMemo(() => {
    return baseURL + '/' + businessUnitKey;
  }, [baseURL, businessUnitKey]);

  // Validate props
  if (!page && !pageKey && !query) {
    throw new Error(
      'PageRenderer requires either page or pageKey or query prop'
    );
  }

  if (page && pageKey && query) {
    console.warn(
      'PageRenderer: Both page and pageKey and query provided. Using page prop.'
    );
  }

  const fetchPageByKey = useCallback(async () => {
    
    try {
      setLoading(true);
      setError(null);

      if (!hydratedUrl) {
        throw new Error('BaseURL is required to fetch page');
      }
      // Note: usePages hook only has fetchPage, no published version support yet
      const fetchedPage = isDraft
      ? await fetchPage(hydratedUrl, pageKey!)
      : await fetchPublishedPage(hydratedUrl, pageKey!);
      setResolvedPage(fetchedPage);
    } catch (err: any) {
      setError(err.message);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [hydratedUrl, pageKey, fetchPage, onError]);

  const fetchPageByQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!hydratedUrl) {
        throw new Error('BaseURL is required to fetch page');
      }
      const fetchedItem = isDraft
        ? await queryPage(hydratedUrl, query!)
        : await queryPublishedPage(hydratedUrl, query!);

      setResolvedPage(fetchedItem);
    } catch (err: any) {
      setError(err.message);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [hydratedUrl, query]);

  // Effect to fetch page by pageKey if needed
  useEffect(() => {
    if (page) {
      // If page is provided directly, use it
      setResolvedPage(page);
      return;
    } else if (!page && pageKey && hydratedUrl) {
      fetchPageByKey();
    } else if (!page && !pageKey && query && hydratedUrl) {
      fetchPageByQuery();
    }

    return undefined; // Return undefined for all other cases
  }, [page, pageKey, query, hydratedUrl, fetchPageByKey, fetchPageByQuery]);

  // Show loading state while fetching
  if (loading) {
    return null;
  }

  // Show error state if fetch failed
  if (error) {
    console.error('Error:', error);
    return null;
  }

  // If no resolved page, show error
  if (!resolvedPage) {
    console.error('Resolved page is null');
    return null;
  }

  // Render the actual PageGridRenderer with the resolved page
  return (
    <PageGridRenderer
      page={resolvedPage}
      baseURL={baseURL}
      {...otherProps}
    />
  );
};

export default PageResolver;
