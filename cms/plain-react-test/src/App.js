import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentType from '@commercetools-demo/contentools-content-types';
import ContentItemRenderer from '@commercetools-demo/contentools-content-item-renderer';
import ContentPages from '@commercetools-demo/contentools-content-pages';
import PageRenderer from '@commercetools-demo/contentools-page-renderer';
import { BackIcon } from '@commercetools-uikit/icons';

function App() {
  return (
    <div className="App">
      <style>
        {`
          :root {
            --page-grid-gap: 5.5rem;
            --page-grid-row-margin: 5.5rem;
          }
        `}
      </style>
      <ContentItem
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        locale="en-us"
        parentUrl=""
        backButton={{
          label: 'Back',
          onClick: () => {
            console.log('Back');
          },
          icon: <BackIcon />,
        }}
      />
      {/* <ContentType
        baseURL="http://localhost:8080/service"
        businessUnitKey="central-texas-animal-hospital"
        locale="en-us"
        parentUrl=""
      /> */}
      {/* <ContentPages
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        locale="en-US"
        parentUrl="content-pages"
        backButton={{
          label: 'Back',
          onClick: () => {
            console.log('Back');
          },
          icon: <BackIcon />,
        }}
      /> */}
      {/* <PageRenderer
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        locale="en-US"
        parentUrl="content-pages"
        // isDraft={true}
        // pageKey="page-b159017d-9baa-435f-b920-04c7db95bf9e"
        query='route="/content/blogs/champagne"'
      /> */}
      {/* <ContentItemRenderer
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        locale="en-US"
        parentUrl="content-items"
        itemKey="item-55a40674-6d1a-43e0-8edb-710cc78bd3a9"
        query='properties(slot="header")'
      /> */}
    </div>
  );
}

export default App;
