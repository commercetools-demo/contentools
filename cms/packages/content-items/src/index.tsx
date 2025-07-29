import { StateProvider } from '@commercetools-demo/cms-state';
import ContentItemRouter from './router';
import { BrowserRouter as Router,  } from 'react-router-dom';
import React from 'react';

const WrappedContentItemApp = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}: {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}) => {
  return (
    <Router basename={`/${parentUrl}`}>
      <StateProvider baseURL={baseURL}>
        <ContentItemRouter
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </StateProvider>
    </Router>
  );
};

export default WrappedContentItemApp;
