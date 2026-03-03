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
      </CardGrid>
    </Spacings.Stack>
  );
};

export default ConfigurationList;
