import React, { useEffect, useState, type ReactElement } from 'react';
import { PuckApiProvider, usePuckApiContext } from '@commercetools-demo/puck-api';
import {
  getPublishedPuckPageApi,
  getPreviewPuckPageApi,
  queryPuckPageApi,
} from '@commercetools-demo/puck-api';
import type { PuckConfig, PuckData, PuckPageValue } from '@commercetools-demo/puck-types';
import { PuckDataRenderer } from './PuckDataRenderer';

// ---------------------------------------------------------------------------
// Inner component (needs PuckApiContext)
// ---------------------------------------------------------------------------

interface PuckRendererInnerProps {
  pageKey?: string;
  slug?: string;
  mode: 'published' | 'preview';
  config: PuckConfig;
  loadingComponent?: ReactElement;
  errorComponent?: ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

const PuckRendererInner: React.FC<PuckRendererInnerProps> = ({
  pageKey,
  slug,
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
        let pageValue: PuckPageValue | null = null;

        if (pageKey) {
          pageValue =
            mode === 'published'
              ? await getPublishedPuckPageApi(baseURL, projectKey, businessUnitKey, pageKey)
              : await getPreviewPuckPageApi(baseURL, projectKey, businessUnitKey, pageKey);
        } else if (slug) {
          pageValue = await queryPuckPageApi(
            baseURL,
            projectKey,
            businessUnitKey,
            slug,
            mode
          );
        }

        if (!cancelled) {
          if (pageValue) {
            setData(pageValue.puckData);
          } else {
            setError('Page not found');
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
  }, [baseURL, projectKey, businessUnitKey, pageKey, slug, mode]);

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
          {error ?? 'Failed to load page'}
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
   * Service base URL. Can be omitted if a PuckApiProvider is already in the tree.
   */
  baseURL?: string;
  /** CommerceTools project key. Can be omitted if provider is in tree. */
  projectKey?: string;
  /** Business unit key. Can be omitted if provider is in tree. */
  businessUnitKey?: string;

  /** Fetch by page key. */
  pageKey?: string;
  /** OR fetch by slug (URL path). */
  slug?: string;

  /** 'published' (default) or 'preview' (draft || published). */
  mode?: 'published' | 'preview';

  /**
   * Puck config — must match the config used in the editor.
   * Import defaultPuckConfig from @commercetools-demo/puck-editor and pass here.
   */
  config: PuckConfig;

  /** Custom loading indicator. */
  loadingComponent?: ReactElement;
  /** Custom error display. */
  errorComponent?: ReactElement;

  className?: string;
  style?: React.CSSProperties;
}

/**
 * Fetches a puck page from the API and renders it using Puck's Render component.
 *
 * Can be used with or without an external PuckApiProvider:
 * - With provider: omit baseURL/projectKey/businessUnitKey
 * - Without provider: provide all three props
 */
export const PuckRenderer: React.FC<PuckRendererProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  pageKey,
  slug,
  mode = 'published',
  config,
  loadingComponent,
  errorComponent,
  className,
  style,
}) => {
  const inner = (
    <PuckRendererInner
      pageKey={pageKey}
      slug={slug}
      mode={mode}
      config={config}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      className={className}
      style={style}
    />
  );

  // If all connection props are provided, wrap in a provider.
  // Otherwise assume a provider is already in the tree.
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
