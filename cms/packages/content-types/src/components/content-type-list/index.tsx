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
import Text from '@commercetools-uikit/text';

type Props = {
  items: (ContentTypeData & { id: string })[];
  baseURL: string;
  businessUnitKey: string;
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
  error,
  onCreateNew,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TColumn<ContentTypeData>[] = [
    {
      key: 'name',
      label: 'Name',
      renderItem: (row: ContentTypeData) => (
        <Text.Body>{row.metadata.name}</Text.Body>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      renderItem: (row: ContentTypeData) => (
        <Text.Body>{row.metadata.type}</Text.Body>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      renderItem: (row: ContentTypeData) => (
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
