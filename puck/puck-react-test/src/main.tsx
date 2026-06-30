import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NimbusProvider } from '@commercetools/nimbus';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

createRoot(root).render(
  <StrictMode>
    <NimbusProvider>
      <App />
    </NimbusProvider>
  </StrictMode>
);
