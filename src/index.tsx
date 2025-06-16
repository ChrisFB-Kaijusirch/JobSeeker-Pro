import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // You'll need to create this CSS file or remove this import

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);