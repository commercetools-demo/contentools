import { Page, StateInfo } from '@commercetools-demo/contentools-types';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import Stamp from '@commercetools-uikit/stamp';
import Text from '@commercetools-uikit/text';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  pages: Page[];
  states: Record<string, StateInfo<Page>>;
};
type PageRow = TRow & Page;

const formatStatus = (status?: StateInfo<Page>): string => {
  if (!status) {
    return 'Draft';
  }

  if (status.draft && status.published) {
    return 'Draft & Published';
  }

  if (status.draft) {
    return 'Draft';
  }

  return 'Published';
};

const formatTone = (status?: StateInfo<Page>) => {
  if (!status) {
    return 'critical';
  }

  if (status.draft && status.published) {
    return 'warning'; // Using archived for "both" state
  }

  return status.draft ? 'information' : 'positive';
};

const PageDataTable = ({ pages, states }: Props) => {
  const history = useHistory();

  const handleEditPage = (pageKey: string) => {
    history.push(`/edit/${pageKey}`);
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Page Name',
        isSortable: true,
      },
      {
        key: 'route',
        label: 'Route',
        isSortable: true,
      },
      {
        key: 'components',
        label: 'Components',
        isSortable: true,
        renderItem: (row: PageRow) => (
          <Text.Body truncate>{row.components.length}</Text.Body>
        ),
      },
      {
        key: 'rows',
        label: 'Layout Rows',
        isSortable: true,
        renderItem: (row: PageRow) => (
          <Text.Body truncate>{row.layout.rows.length}</Text.Body>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        renderItem: (row: PageRow) => (
          <Stamp tone={formatTone(states[row.key])}>
            {formatStatus(states[row.key])}
          </Stamp>
        ),
      },
    ],
    []
  );

  // Transform pages data for DataTable
  const tableRows: PageRow[] = useMemo(
    () =>
      pages.map((page) => ({
        id: page.key,
        name: page.name,
        route: page.route,
        components: page.components || [],
        rows: page.layout?.rows || [],
        key: page.key,
        layout: page.layout,
      })),
    [pages]
  );
  return (
    <DataTable
      columns={columns}
      rows={tableRows}
      onRowClick={(row) => handleEditPage(row.key)}
    />
  );
};

export default PageDataTable;
