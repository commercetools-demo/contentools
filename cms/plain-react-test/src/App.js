import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/cms-content-items';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <ContentItem
      baseURL="http://localhost:8080/service"
      businessUnitKey="central-texas-animal-hospital"
      locale="en-US"
      parentUrl="content-items"
    />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
