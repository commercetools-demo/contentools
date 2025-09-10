import {
  useStateContentType,
  useStateDatasource,
} from '@commercetools-demo/contentools-state';
import {
  ContentItem,
  ContentTypeMetaData,
  PropertySchema,
} from '@commercetools-demo/contentools-types';
import React, { useCallback, useEffect, useState } from 'react';
import ContentItemPreview from '../content-item-preview';

interface PropertyEditorPreviewProps {
  item: ContentItem;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

const PropertyEditorPreview: React.FC<PropertyEditorPreviewProps> = ({
  item,
  baseURL,
  businessUnitKey,
  locale,
}) => {
  const { contentTypes } = useStateContentType();
  const { testDatasource } = useStateDatasource()!;
  const [metadata, setMetadata] = useState<ContentTypeMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolvedItem, setResolvedItem] = useState<ContentItem | null>(null);
  const [resolvedDatasources, setResolvedDatasources] = useState<
    Record<string, any>
  >({});
  const [datasource, setDatasource] = useState<Record<string, PropertySchema>>(
    {}
  );

  const resolveDatasource = useCallback(
    async (datasourceKey: string, params: Record<string, any>) => {
      return testDatasource(datasourceKey, params).catch((err) => {
        console.error('Error resolving datasource:', err);
        return null;
      });
    },
    [testDatasource]
  );

  const resolveAllDatasources = useCallback(
    async (datasources: Record<string, PropertySchema>) => {
      const ds = Object.entries(datasources).map(async ([key, property]) => {
        const result = await resolveDatasource(
          property.datasourceType!,
          item.properties[key]?.params || {}
        );
        return {
          [key]: result,
        };
      });
      return Promise.all(ds);
    },
    [item.properties, resolveDatasource]
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const contentType =
          contentTypes.find((ct) => ct.key === item.type) || null;
        setMetadata(contentType?.metadata || null);
      } catch (err) {
        console.error('Error loading component metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [item.type, contentTypes]);

  useEffect(() => {
    if (metadata) {
      const ds = Object.entries(metadata.propertySchema)
        .filter(([key, property]) => property.type === 'datasource')
        .reduce((acc, [key, property]) => {
          acc[key] = property;
          return acc;
        }, {} as Record<string, PropertySchema>);
      if (Object.keys(ds).length > 0) {
        setDatasource(ds);
      } else {
        setResolvedItem(item);
      }
    }
  }, [metadata]);

  useEffect(() => {
    if (Object.keys(datasource || {}).length > 0) {
      resolveAllDatasources(datasource).then((resolved) => {
        if (resolved?.length > 0) {
          const ds = resolved.reduce((acc, curr) => {
            return { ...acc, ...curr };
          }, {});
          setResolvedDatasources(ds);
        }
      });
    }
  }, [datasource]);

  useEffect(() => {
    if (Object.keys(resolvedDatasources || {}).length > 0) {
      setResolvedItem({
        ...item,
        properties: { ...item.properties, ...resolvedDatasources },
      });
    }
  }, [resolvedDatasources]);

  if (!resolvedItem) {
    return null;
  }

  return (
    <ContentItemPreview
      item={resolvedItem}
      baseURL={baseURL}
      businessUnitKey={businessUnitKey}
      locale={locale}
    />
  );
};

export default PropertyEditorPreview;
