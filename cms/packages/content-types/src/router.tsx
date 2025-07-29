import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ContentTypesApp from './components/content-types';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}
const ContentTypeRouter = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
}: Props) => {
  const match = useRouteMatch();

  return (
    <>
      <Route path="/">
        <ContentTypesApp
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </Route>
      <Route path={`/new-content-type`} exact>
        <span>New content type</span>
      </Route>
      <Route path={`/content-type/:contentTypeKey`} exact>
        <span>Content type</span>
      </Route>
    </>
  );
};

export default ContentTypeRouter;
