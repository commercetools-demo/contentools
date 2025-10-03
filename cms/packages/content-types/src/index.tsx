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
  backButton,
  style,
}: {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;

  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
  style?: React.CSSProperties;
}) => {
  return (
    <div style={style}>
      <Router basename={`/${parentUrl}`}>
        <StateProvider baseURL={baseURL}>
          <ContentTypeRouter
            backButton={backButton}
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
