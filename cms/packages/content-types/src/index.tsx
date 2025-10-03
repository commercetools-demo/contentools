import { StateProvider } from '@commercetools-demo/contentools-state';
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
  style,
}: {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div style={style}>
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
    </div>
  );
};

export default WrappedContentTypeApp;
