import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
`;

interface ContentItemRendererProps {
  baseURL: string;
  itemKey: string;
  businessUnitKey: string;
}

export const ContentItemRenderer: FC<ContentItemRendererProps> = ({
  baseURL,
  itemKey,
  businessUnitKey,
}) => {
  return (
    <Container>
      <h2>ContentItemRenderer</h2>
      <p>Content Item Renderer for item: {itemKey}</p>
      <p>Base URL: {baseURL}</p>
      <p>Business Unit: {businessUnitKey}</p>
    </Container>
  );
};

export default ContentItemRenderer; 