import React, { useState } from 'react';
import ContentItemApp from './apps/content-item-app';

type PreviewMode = 'components' | 'full-cms' | 'content-types' | 'pages';

const App: React.FC = () => {


  return (
    <ContentItemApp baseURL="http://localhost:8080/service" businessUnitKey="central-texas-animal-hospital" />
      
  );
};

export default App; 