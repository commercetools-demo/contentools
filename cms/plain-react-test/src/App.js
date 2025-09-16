import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentType from '@commercetools-demo/contentools-content-types';
import ContentItemRenderer from '@commercetools-demo/contentools-content-item-renderer';
import ContentPages from '@commercetools-demo/contentools-content-pages';
import PageRenderer from '@commercetools-demo/contentools-page-renderer';

function App() {
  return (
    <div className="App">
      <ContentItem
        baseURL="http://localhost:8080/service"
        businessUnitKey="central-texas-animal-hospital"
        locale="en-us"
        parentUrl=""
      />
      <ContentType
        baseURL="http://localhost:8080/service"
        businessUnitKey="central-texas-animal-hospital"
        locale="en-us"
        parentUrl=""
      />
      {/* <ContentPages
        baseURL="http://localhost:8080/service"
        businessUnitKey="central-texas-animal-hospital"
        locale="en-US"
        parentUrl="content-pages"
      /> */}
      {/* <PageRenderer
        baseURL="http://localhost:8080/service"
        businessUnitKey="central-texas-animal-hospital"
        locale="en-US"
        parentUrl="content-pages"
        isDraft={true}
        // pageKey="page-b159017d-9baa-435f-b920-04c7db95bf9e"
        query='route="/asdsd"'
        style={{
          '--page-grid-gap': '0.5rem',
          '--page-grid-row-margin': '0.5rem',
        }}
      /> */}
      {/* <ContentItemRenderer
        baseURL="http://localhost:8080/service"
        businessUnitKey="business_unit_behnam"
        locale="en-US"
        parentUrl="content-items"
        itemKey="item-8c3bbf44-25ab-4297-8b64-543e0671f0a2"
        query='properties(slot="header")'
      /> */}
    </div>
  );
}

export default App;
