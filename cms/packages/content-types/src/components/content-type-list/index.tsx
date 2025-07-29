import { ContentTypeData } from '@commercetools-demo/cms-types';
import React from 'react';
import DataTable, { TColumn, TRow } from '@commercetools-uikit/data-table';
import IconButton from '@commercetools-uikit/icon-button';
import {
  BinLinearIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
} from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import styled from 'styled-components';

type Props = {
  items: (ContentTypeData & { id: string })[];
  baseURL: string;
  businessUnitKey: string;
  loading: boolean;
  error: string | null;
  onCreateNew: () => void;
  onEdit: (item: ContentTypeData) => void;
  onDelete: (key: string) => void;
};

const StyledH1 = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const ContentTypeList = ({
  items,
  baseURL,
  businessUnitKey,
  loading,
  error,
  onCreateNew,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TColumn<ContentTypeData & { id: string }>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'actions',
      label: 'Actions',
      renderItem: (row: ContentTypeData & { id: string }) => (
        <Spacings.Inline alignItems="center">
          <IconButton
            onClick={() => onEdit?.(row)}
            label="Edit"
            icon={<EditIcon />}
          >
            Edit
          </IconButton>
          <IconButton
            onClick={() => onDelete?.(row.metadata.type)}
            label="Delete"
            icon={<BinLinearIcon />}
          >
            Delete
          </IconButton>
        </Spacings.Inline>
      ),
    },
  ];
  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <StyledH1>Content Items</StyledH1>
        <PrimaryButton onClick={onCreateNew} label="Create New" />
      </Spacings.Inline>

      <DataTable columns={columns} rows={items} />
    </Spacings.Stack>
  );
};

export default ContentTypeList;
