import React, { useEffect, useState, type ReactElement } from 'react';
import { PuckApiProvider, usePuckApiContext } from '@commercetools-demo/puck-api';
import {
  getPublishedPuckPageApi,
  getPreviewPuckPageApi,
  queryPuckPageApi,
  getPublishedPuckContentApi,
  getPreviewPuckContentApi,
  queryPuckContentApi,
} from '@commercetools-demo/puck-api';
import type { PuckConfig, PuckData } from '@commercetools-demo/puck-types';
import { PuckDataRenderer } from './PuckDataRenderer';

// ---------------------------------------------------------------------------
// Inner component (needs PuckApiContext)
// ---------------------------------------------------------------------------

interface PuckRendererInnerProps {
  type: 'page' | 'content';
  pageKey?: string;
  slug?: string;
  contentKey?: string;
  query?: string;
  mode: 'published' | 'preview';
  config: PuckConfig;
  loadingComponent?: ReactElement;
  errorComponent?: ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

const PuckRendererInner: React.FC<PuckRendererInnerProps> = ({
  type,
  pageKey,
  slug,
  contentKey,
  query,
  mode,
  config,
  loadingComponent,
  errorComponent,
  className,
  style,
}) => {
  const { baseURL, projectKey, businessUnitKey } = usePuckApiContext();

  const [data, setData] = useState<PuckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === 'content') {
          let puckData: PuckData | null = null;

          if (contentKey) {
            const value =
              mode === 'published'
                ? await getPublishedPuckContentApi(baseURL, projectKey, businessUnitKey, contentKey)
                : await getPreviewPuckContentApi(baseURL, projectKey, businessUnitKey, contentKey);
            puckData = value.data;
          } else if (query) {
            const value = await queryPuckContentApi(baseURL, projectKey, businessUnitKey, query, mode);
            puckData = value?.data ?? null;
          }

          if (!cancelled) {
            if (puckData) {
              setData(puckData);
            } else {
              setError('Content not found');
            }
          }
        } else {
          // type === 'page'
          let pageValue = null;

          if (pageKey) {
            pageValue =
              mode === 'published'
                ? await getPublishedPuckPageApi(baseURL, projectKey, businessUnitKey, pageKey)
                : await getPreviewPuckPageApi(baseURL, projectKey, businessUnitKey, pageKey);
          } else if (slug) {
            pageValue = await queryPuckPageApi(baseURL, projectKey, businessUnitKey, slug, mode);
          }

          if (!cancelled) {
            if (pageValue) {
              setData(pageValue.puckData);
            } else {
              setError('Page not found');
            }
          }
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [baseURL, projectKey, businessUnitKey, type, pageKey, slug, contentKey, query, mode]);

  if (loading) {
    return (
      loadingComponent ?? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px',
            color: '#6b7280',
          }}
        >
          Loading…
        </div>
      )
    );
  }

  if (error || !data) {
    return (
      errorComponent ?? (
        <div
          style={{
            padding: '32px',
            color: '#dc2626',
            background: '#fef2f2',
            borderRadius: '8px',
          }}
        >
          {error ?? 'Failed to load'}
        </div>
      )
    );
  }

  return <PuckDataRenderer data={data} config={config} className={className} style={style} />;
};

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface PuckRendererProps {
  /**
   * Whether to render a page or a content item. Defaults to 'page'.
   * - 'page': use pageKey or slug to fetch
   * - 'content': use contentKey or query (contentType) to fetch
   */
  type?: 'page' | 'content';

  /**
   * Service base URL. Can be omitted if a PuckApiProvider is already in the tree.
   */
  baseURL?: string;
  /** CommerceTools project key. Can be omitted if provider is in tree. */
  projectKey?: string;
  /** Business unit key. Can be omitted if provider is in tree. */
  businessUnitKey?: string;

  /** [type=page] Fetch by page key. */
  pageKey?: string;
  /** [type=page] OR fetch by slug (URL path). */
  slug?: string;

  /** [type=content] Fetch by content key. */
  contentKey?: string;
  /** [type=content] OR fetch by contentType query string. */
  query?: string;

  /** 'published' (default) or 'preview' (draft || published). */
  mode?: 'published' | 'preview';

  /**
   * Puck config — must match the config used in the editor.
   */
  config: PuckConfig;

  /** Custom loading indicator. */
  loadingComponent?: ReactElement;
  /** Custom error display. */
  errorComponent?: ReactElement;

  className?: string;
  style?: React.CSSProperties;
}

export const PuckRenderer: React.FC<PuckRendererProps> = ({
  type = 'page',
  baseURL,
  projectKey,
  businessUnitKey,
  pageKey,
  slug,
  contentKey,
  query,
  mode = 'published',
  config,
  loadingComponent,
  errorComponent,
  className,
  style,
}) => {
  const inner = (
    <PuckRendererInner
      type={type}
      pageKey={pageKey}
      slug={slug}
      contentKey={contentKey}
      query={query}
      mode={mode}
      config={config}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      className={className}
      style={style}
    />
  );

  if (baseURL && projectKey && businessUnitKey) {
    return (
      <PuckApiProvider
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
      >
        {inner}
      </PuckApiProvider>
    );
  }

  return inner;
};
