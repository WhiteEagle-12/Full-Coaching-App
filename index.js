import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App'; // ✅ FIX: Import the default export 'AppWrapper'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper /> 
  </React.StrictMode>
);
