import {
  StateProvider
} from '@commercetools-demo/cms-state';
import ContentItemApp from './components/content-items';

const WrappedContentItemApp = ({
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}: {
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}) => {
  return (
    <StateProvider baseURL={baseURL}>
      <ContentItemApp
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        locale={locale}
      />
    </StateProvider>
  );
};

export default WrappedContentItemApp ;
