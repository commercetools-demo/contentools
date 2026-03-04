import React from 'react';
import { Route } from 'react-router-dom';
import ConfigurationList from './components/configuration-list';
import ThemeEditor from './components/theme-editor';
import HeaderEditor from './components/header-editor';
import ImportContentTypes from './components/import-content-types';

interface Props {
  parentUrl: string;
  businessUnitKey: string;
  baseURL: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const ConfigurationRouter: React.FC<Props> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  return (
    <>
      <Route path="/">
        <ConfigurationList parentUrl={parentUrl} backButton={backButton} />
      </Route>
      <Route path="/theme" exact>
        <ThemeEditor
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          backButton={backButton}
        />
      </Route>
      <Route path="/header" exact>
        <HeaderEditor
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          backButton={backButton}
        />
      </Route>
      <Route path="/import-content-types" exact>
        <ImportContentTypes
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          backButton={backButton}
        />
      </Route>
    </>
  );
};

export default ConfigurationRouter;
