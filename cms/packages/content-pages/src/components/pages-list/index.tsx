import { useStatePages } from '@commercetools-demo/contentools-state';
import Card from '@commercetools-uikit/card';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PageDataTable from './page-datatable';

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
  const { pages, states, loading, error, fetchPages } = useStatePages()!;
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  useEffect(() => {
    // Load pages on component mount
    fetchPages(hydratedUrl);
  }, [hydratedUrl, fetchPages]);

  const handleCreatePage = () => {
    history.push(`/new`);
  };

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
          <PageDataTable pages={pages} states={states} />
        </TableContainer>
      )}
    </Container>
  );
};

export default PagesList;
