import { StateProvider } from '@commercetools-demo/cms-state';
import ContentTypeRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

// Export the new ContentTypeForm component
export { default as ContentTypeForm } from './components/content-type-form';
export { default as ContentTypes } from './components/content-types';

const WrappedContentTypeApp = ({
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
        <ContentTypeRouter
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </StateProvider>
    </Router>
  );
};

export default WrappedContentTypeApp;
