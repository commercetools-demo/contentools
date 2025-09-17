import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PagesList from './components/pages-list';
import PagesNew from './components/new-page-modal';
import PagesEdit from './components/pages-edit';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const PagesRouter = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
  backButton,
}: Props) => {
  const match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <PagesList
            backButton={backButton}
            parentUrl={parentUrl}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            locale={locale}
          />
        </Route>
        <Route path={`/edit/:pageKey`} exact>
          <PagesEdit
            parentUrl={parentUrl}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            locale={locale}
          />
        </Route>
      </Switch>

      <Route path={`/new`} exact>
        <PagesNew
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </Route>
    </>
  );
};

export default PagesRouter;
