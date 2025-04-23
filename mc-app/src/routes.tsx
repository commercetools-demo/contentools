import type { ReactNode } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import CMSAppWrapper from './components/web-component-wrapper';
import ScriptLoader from './components/web-component-wrapper/script-loader';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {

  const context = useApplicationContext();

  console.log(context);

  return (
    <Spacings.Inset scale="l">
      <ScriptLoader
        src={(context?.environment as any)?.assetsUrl}
        id="layout-cms-script"
      />
      <CMSAppWrapper
        baseurl='https://service-hkjjhajhsqatxuijppbca4vh.us-central1.gcp.preview.commercetools.app/service'
        business-unit-key='1'
        available-locales='["en-US", "fr-FR", "de-DE"]'
        locale='en-US'
      />
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
