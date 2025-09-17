import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ContentItemApp from './components/content-items';
import ContentTypeModal from './components/content-type-new-modal/content-type-new-modal';
import ContentItemEditor from './components/content-item-editor';

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
const ContentItemRouter = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
  backButton,
}: Props) => {
  const match = useRouteMatch();

  return (
    <>
      <Route path="/">
        <ContentItemApp
          backButton={backButton}
          parentUrl={parentUrl}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
          locale={locale}
        />
      </Route>
      <Route path={`/new-content-item`} exact>
        <ContentTypeModal />
      </Route>
      <Route path={`/new-content-item/:contentTypeKey`} exact>
        <ContentItemEditor
          locale={locale}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
        />
      </Route>
      <Route path={`/content-item/:contentItemKey`} exact>
        <ContentItemEditor
          locale={locale}
          baseURL={baseURL}
          businessUnitKey={businessUnitKey}
        />
      </Route>
    </>
  );
};

export default ContentItemRouter;
