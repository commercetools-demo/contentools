import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/cms-content-items';

function App() {
  return (
    <div className="App">
      <ContentItem
          baseURL="http://localhost:8080/service"
          businessUnitKey="business_unit_behnam"
          locale="en-US"
          parentUrl="content-items"
        />
    </div>
  );
}

export default App;
