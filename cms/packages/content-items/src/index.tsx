import { StateProvider } from '@commercetools-demo/contentools-state';
import ContentItemRouter from './router';
import { BrowserRouter as Router } from 'react-router-dom';

const WrappedContentItemApp = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale = 'en-US',
  backButton,
  style,
}: {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
  style?: React.CSSProperties;
}) => {
  return (
    <div style={style}>
      <Router basename={`/${parentUrl}`}>
        <StateProvider baseURL={baseURL}>
          <ContentItemRouter
            backButton={backButton}
            parentUrl={parentUrl}
            baseURL={baseURL}
            businessUnitKey={businessUnitKey}
            locale={locale}
          />
        </StateProvider>
      </Router>
    </div>
  );
};

export default WrappedContentItemApp;
