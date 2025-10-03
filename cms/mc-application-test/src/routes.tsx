import { type ReactNode } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Welcome from './components/welcome';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentPage from '@commercetools-demo/contentools-content-pages';
import ContentType from '@commercetools-demo/contentools-content-types';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ListIcon } from '@commercetools-uikit/icons';
type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { environment, dataLocale, project } = useApplicationContext<{
    CMS_API_URL: string;
    BUSINESS_UNIT_KEY: string;
    dataLocale: string;
  }>();

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/merchant-center-customizations/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/pages`}>
          <ContentPage
            baseURL={environment.CMS_API_URL}
            businessUnitKey={environment.BUSINESS_UNIT_KEY}
            locale={dataLocale ?? 'en-US'}
            parentUrl={`${match.url.slice(1)}/pages`}
            backButton={{
              icon: <ListIcon />,
              label: 'Back',
              onClick: () => {
                history.push(match.url);
              },
            }}
          />
        </Route>
        <Route path={`${match.path}/items`}>
          <ContentItem
            baseURL={environment.CMS_API_URL}
            businessUnitKey={environment.BUSINESS_UNIT_KEY}
            locale={dataLocale ?? 'en-US'}
            parentUrl={`${match.url.slice(1)}/items`}
            backButton={{
              icon: <ListIcon />,
              label: 'Back',
              onClick: () => {
                history.push(match.url);
              },
            }}
          />
        </Route>
        <Route path={`${match.path}/types`}>
          <ContentType
            baseURL={environment.CMS_API_URL}
            businessUnitKey={environment.BUSINESS_UNIT_KEY}
            locale={dataLocale ?? 'en-US'}
            parentUrl={`${match.url.slice(1)}/types`}
          />
        </Route>
        <Route>
          <Welcome />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
