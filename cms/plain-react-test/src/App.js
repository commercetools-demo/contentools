import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentType from '@commercetools-demo/contentools-content-types';
import ContentItemRenderer from '@commercetools-demo/contentools-content-item-renderer';

function App() {
  return (
    <div className="App">
      <ContentItem
        baseURL="http://localhost:8080/service"
        businessUnitKey="business_unit_behnam"
        locale="en-US"
        parentUrl="content-items"
      />
      <ContentType
        baseURL="http://localhost:8080/service"
        businessUnitKey="business_unit_behnam"
        locale="en-US"
        parentUrl="content-types"
      />
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
