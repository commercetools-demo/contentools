import {
  StateProvider
} from '@commercetools-demo/cms-state';
import ContentItemRouter from './router';

const WrappedContentItemApp = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
}: {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
}) => {
  return (
    <StateProvider baseURL={baseURL}>
      <ContentItemRouter
        parentUrl={parentUrl}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
        locale={locale}
      />
    </StateProvider>
  );
};

export default WrappedContentItemApp ;
