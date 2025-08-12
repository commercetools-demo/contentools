import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentType from '@commercetools-demo/contentools-content-types';

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
    </div>
  );
}

export default App;
