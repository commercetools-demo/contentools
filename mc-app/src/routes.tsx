import type { ReactNode } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Welcome from './components/welcome';
type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  return (
    <Spacings.Inset scale="l">
      <Welcome />
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
