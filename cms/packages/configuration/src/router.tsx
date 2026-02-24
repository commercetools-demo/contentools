import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConfigurationList from './components/configuration-list';
import ThemeEditor from './components/theme-editor';

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
        <ConfigurationList
          parentUrl={parentUrl}
          backButton={backButton}
        />
      </Route>
      <Route path="/theme" exact>
        <ThemeEditor
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
