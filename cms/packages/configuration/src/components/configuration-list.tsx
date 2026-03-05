import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import styled from 'styled-components';

interface Props {
  parentUrl: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const StyledCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ConfigurationList: React.FC<Props> = ({ backButton }) => {
  const history = useHistory();

  return (
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={backButton.onClick}
          label={backButton.label}
          icon={backButton.icon as React.ReactElement}
        >
          {backButton.label}
        </FlatButton>
      )}
      <Text.Headline as="h1">Configuration</Text.Headline>
      <Text.Body tone="secondary">
        Manage global configuration for your project.
      </Text.Body>
      <CardGrid>
        <StyledCard
          onClick={() => history.push('/theme')}
          data-testid="configuration-theme-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Theme</Text.Headline>
            <Text.Body>
              Customize colors, typography, spacing, and component styles.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/header')}
          data-testid="configuration-header-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Header</Text.Headline>
            <Text.Body>
              Configure navigation, logo, visibility, and utility bar.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/footer')}
          data-testid="configuration-footer-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Footer</Text.Headline>
            <Text.Body>
              Configure footer columns, copyright, and social links.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/facet')}
          data-testid="configuration-facet-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Facet</Text.Headline>
            <Text.Body>
              Configure product listing facets and display options.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/category-listing')}
          data-testid="configuration-category-listing-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Category listing</Text.Headline>
            <Text.Body>
              Configure sort options and page size for category pages.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/site-metadata')}
          data-testid="configuration-site-metadata-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Site metadata</Text.Headline>
            <Text.Body>
              Configure SEO title, description, and open graph image.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/translations')}
          data-testid="configuration-translations-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Translations</Text.Headline>
            <Text.Body>
              Per-locale translation overrides for the storefront.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
        <StyledCard
          onClick={() => history.push('/import-content-types')}
          data-testid="configuration-import-content-types-card"
        >
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Import default content types</Text.Headline>
            <Text.Body>
              Import default content type definitions from samples into your
              project.
            </Text.Body>
          </Spacings.Stack>
        </StyledCard>
      </CardGrid>
    </Spacings.Stack>
  );
};

export default ConfigurationList;
