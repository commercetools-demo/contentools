import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useStatePages } from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Card from '@commercetools-uikit/card';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import styled from 'styled-components';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const PagesList: React.FC<Props> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale: _locale,
}) => {
  const history = useHistory();
  const { pages, loading, error, fetchPages } = useStatePages()!;
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  useEffect(() => {
    // Load pages on component mount
    fetchPages(hydratedUrl);
  }, [hydratedUrl, fetchPages]);

  const handleCreatePage = () => {
    history.push(`/new`);
  };

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
      },
      {
        key: 'rows',
        label: 'Layout Rows',
        isSortable: true,
      },
    ],
    []
  );

  // Transform pages data for DataTable
  const tableRows = useMemo(
    () =>
      pages.map((page) => ({
        id: page.key,
        name: page.name,
        route: page.route,
        components: page.components?.length || 0,
        rows: page.layout?.rows?.length || 0,
        page, // Keep reference to original page for row click
      })),
    [pages]
  );

  if (loading && pages.length === 0) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">Error</Text.Headline>
            <Text.Body tone="critical">{error}</Text.Body>
          </Spacings.Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Text.Headline as="h1">Pages</Text.Headline>
        <PrimaryButton label="Create Page" onClick={handleCreatePage} />
      </Header>

      {pages.length === 0 ? (
        <EmptyState>
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">No pages yet</Text.Headline>
            <Text.Body>
              Create your first page to get started with your content
              management.
            </Text.Body>
          </Spacings.Stack>
          <PrimaryButton
            label="Create Your First Page"
            onClick={handleCreatePage}
          />
        </EmptyState>
      ) : (
        <TableContainer>
          <DataTable
            columns={columns}
            rows={tableRows}
            onRowClick={(row) => handleEditPage(row.page.key)}
          />
        </TableContainer>
      )}
    </Container>
  );
};

export default PagesList;
