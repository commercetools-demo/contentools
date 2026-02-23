import React from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import PagesRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

interface WrappedContentPagesAppProps {
  parentUrl: string;
  baseURL: string;
  projectKey: string;
  jwtToken?: string;
  businessUnitKey: string;
  locale?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const WrappedContentPagesApp: React.FC<WrappedContentPagesAppProps> = ({
  parentUrl,
  baseURL,
  projectKey,
  jwtToken,
  businessUnitKey,
  locale = 'en-US',
  backButton,
}) => {
  return (
    <Router basename={`/${parentUrl}`}>
      <StateProvider baseURL={baseURL} projectKey={projectKey} jwtToken={jwtToken}>
        <PagesRouter
          backButton={backButton}
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
