import logo from './logo.svg';
import './App.css';
import ContentItem from '@commercetools-demo/contentools-content-items';
import ContentType from '@commercetools-demo/contentools-content-types';
import ContentItemRenderer from '@commercetools-demo/contentools-content-item-renderer';
import ContentPages from '@commercetools-demo/contentools-content-pages';
import PageRenderer from '@commercetools-demo/contentools-page-renderer';
import Configuration from '@commercetools-demo/contentools-configuration';
import { BackIcon } from '@commercetools-uikit/icons';

function App() {
  return (
    <div className="App">
       {/* <ContentItem
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        projectKey="us-store"
        jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1zdG9yZSIsImlzcyI6Im11bHRpdGVuYW50LWNvbnRlbnRvb2xzIiwiYXVkIjoibXVsdGl0ZW5hbnQtY29udGVudG9vbHMiLCJpYXQiOjE3NzIyMjA1MzAsImV4cCI6MTc3MjgyNTMzMH0.p3DU_uCAhZn2XlCPPcnRvmFuHZSRo31N9_lQocOEgcA"
        locale="en-us"
        parentUrl=""
      /> */}
      {/* <ContentType
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        projectKey="us-store"
        jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1zdG9yZSIsImlzcyI6Im11bHRpdGVuYW50LWNvbnRlbnRvb2xzIiwiYXVkIjoibXVsdGl0ZW5hbnQtY29udGVudG9vbHMiLCJpYXQiOjE3NzIyMjA1MzAsImV4cCI6MTc3MjgyNTMzMH0.p3DU_uCAhZn2XlCPPcnRvmFuHZSRo31N9_lQocOEgcA"
        locale="en-us"
        parentUrl=""
      />  */}
       <Configuration
        baseURL="http://localhost:8080/service"
        businessUnitKey="default"
        projectKey="us-store"
        jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1zdG9yZSIsImlzcyI6Im11bHRpdGVuYW50LWNvbnRlbnRvb2xzIiwiYXVkIjoibXVsdGl0ZW5hbnQtY29udGVudG9vbHMiLCJpYXQiOjE3NzIyMjA1MzAsImV4cCI6MTc3MjgyNTMzMH0.p3DU_uCAhZn2XlCPPcnRvmFuHZSRo31N9_lQocOEgcA"
        locale="en-us"
        parentUrl=""
        backButton={{
          label: 'Back',
          onClick: () => console.log('Back'),
          icon: <BackIcon />,
        }}
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
        businessUnitKey="default"
        projectKey="us-store"

        locale="en-US"
        query='properties(slot="logo")'
      /> */}
    </div>
  );
}

export default App;
