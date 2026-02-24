import React from 'react';
import { StateProvider } from '@commercetools-demo/contentools-state';
import ConfigurationRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

export interface WrappedConfigurationAppProps {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  projectKey: string;
  jwtToken?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const WrappedConfigurationApp: React.FC<WrappedConfigurationAppProps> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  projectKey,
  jwtToken,
  backButton,
}) => {
  return (
    <Router basename={`/${parentUrl}`}>
      <StateProvider
        baseURL={baseURL}
        projectKey={projectKey}
        jwtToken={jwtToken}
      >
        <ConfigurationRouter
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          backButton={backButton}
          parentUrl={parentUrl}
        />
      </StateProvider>
    </Router>
  );
};

export default WrappedConfigurationApp;
