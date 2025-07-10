import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
`;

interface CmsRendererProps {
  baseURL: string;
  pageKey: string;
  businessUnitKey: string;
}

export const CmsRenderer: FC<CmsRendererProps> = ({
  baseURL,
  pageKey,
  businessUnitKey,
}) => {
  return (
    <Container>
      <h2>CmsRenderer</h2>
      <p>Page Renderer for page: {pageKey}</p>
      <p>Base URL: {baseURL}</p>
      <p>Business Unit: {businessUnitKey}</p>
    </Container>
  );
};

export default CmsRenderer; 