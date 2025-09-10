import React from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import PagesRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

interface WrappedContentPagesAppProps {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}

const WrappedContentPagesApp: React.FC<WrappedContentPagesAppProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}) => {
  return (
    <Router basename={`/${parentUrl}`}>
      <StateProvider baseURL={baseURL}>
        <PagesRouter
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </StateProvider>
    </Router>
  );
};

export default WrappedContentPagesApp;
