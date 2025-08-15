import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ContentTypesApp from './components/content-types';
import ContentTypeNewModal from './components/content-type-new-modal/content-type-new-modal';
import ContentTypeEditModal from './components/content-type-edit-modal/content-type-edit-modal';

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
        <ContentTypeNewModal
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </Route>
      <Route path={`/content-type/:contentTypeKey`} exact>
        <ContentTypeEditModal
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </Route>
    </>
  );
};

export default ContentTypeRouter;
