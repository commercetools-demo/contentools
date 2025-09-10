import { useStateContentType } from '@commercetools-demo/contentools-state';
import { ContentItem, StateInfo } from '@commercetools-demo/contentools-types';
import { StateTag } from '@commercetools-demo/contentools-ui-components';
import DataTable, { TColumn, TRow } from '@commercetools-uikit/data-table';
import IconButton from '@commercetools-uikit/icon-button';
import {
  BinLinearIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
} from '@commercetools-uikit/icons';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Stamp from '@commercetools-uikit/stamp';
import Text from '@commercetools-uikit/text';
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

interface ContentItemListProps {
  items: ContentItem[];
  states: Record<string, StateInfo<ContentItem>>;
  baseURL: string;
  businessUnitKey: string;
  loading?: boolean;
  error?: string | null;
  onCreateNew?: () => void;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (key: string) => void;
}

type ContentItemRow = TRow & ContentItem;

export const ContentItemList: React.FC<ContentItemListProps> = ({
  items,
  states,
  baseURL,
  businessUnitKey,
  loading = false,
  error = null,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  const { contentTypes } = useStateContentType();
  const handleCopy = (item: ContentItem) => {
    navigator.clipboard.writeText(item.key);
    alert('Item ID copied to clipboard');
  };

  const handleJson = (item: ContentItem) => {
    window.open(
      `${baseURL}/${businessUnitKey}/published/content-items/${item.key}`,
      '_blank'
    );
  };

  const columns: TColumn<ContentItemRow>[] = [
    {
      key: 'name',
      label: 'Name',
      renderItem: (row: ContentItemRow) => <Text.Body>{row.name}</Text.Body>,
    },
    {
      key: 'key',
      label: 'Key',
      renderItem: (row: ContentItemRow) => (
        <Text.Body truncate>{row.key}</Text.Body>
      ),
    },
    {
      key: 'slot',
      label: 'Slot',
      renderItem: (row: ContentItemRow) => (
        <Text.Body>{row.properties?.slot || '-'}</Text.Body>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      renderItem: (row: ContentItemRow) => (
        <StateTag status={states[row.key]} />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      renderItem: (row: ContentItemRow) => (
        <Spacings.Inline alignItems="center">
          <IconButton
            onClick={() => onEdit?.(row)}
            label="Edit"
            size="20"
            icon={<EditIcon />}
          >
            Edit
          </IconButton>
          <IconButton
            onClick={() => onDelete?.(row.key)}
            label="Delete"
            size="20"
            icon={<BinLinearIcon />}
          >
            Delete
          </IconButton>
          <IconButton
            onClick={() => handleCopy(row)}
            label="Copy ID"
            size="20"
            icon={<CopyIcon />}
          >
            Copy ID
          </IconButton>
          <IconButton
            onClick={() => handleJson(row)}
            label="Open JSON"
            size="20"
            icon={<ExternalLinkIcon />}
          >
            Open JSON
          </IconButton>
        </Spacings.Inline>
      ),
    },
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Text.Headline as="h1">Content Items</Text.Headline>
        <PrimaryButton onClick={onCreateNew} label="Create New" />
      </Spacings.Inline>

      <DataTable columns={columns} rows={items} />
    </Spacings.Stack>
  );
};
