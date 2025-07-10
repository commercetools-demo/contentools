import React from 'react';
import styled from 'styled-components';
import DataTable, { TColumn, TRow } from '@commercetools-uikit/data-table';


export interface TableProps<T extends TRow> {
  columns: TColumn<TRow>[];
  data: TRow[];
  onRowClick?: (row: TRow, index: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #666;
`;

export function Table<T extends TRow>({ 
  columns,
  data,
  onRowClick,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
  className 
}: TableProps<T>) {
  
  
  if (loading) {
    return (
      <TableContainer className={className}>
        <LoadingState>Loading...</LoadingState>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer className={className}>
        <EmptyState>{emptyMessage}</EmptyState>
      </TableContainer>
    );
  }

  return (
      <DataTable
        columns={columns}
        rows={data}
        onRowClick={onRowClick}
        onSortChange={onSort}
        // onSort={onSort}
        // sortKey={sortKey}
        // sortDirection={sortDirection}
      />
  );
} 