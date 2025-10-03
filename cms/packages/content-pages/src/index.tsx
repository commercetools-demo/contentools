import React from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import PagesRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

interface WrappedContentPagesAppProps {
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
}

const WrappedContentPagesApp: React.FC<WrappedContentPagesAppProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
  backButton,
  style,
}) => {
  return (
    <div style={style}>
    <Router basename={`/${parentUrl}`}>
      <StateProvider baseURL={baseURL}>
        <PagesRouter
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

export default WrappedContentPagesApp;
