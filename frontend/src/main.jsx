// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Make sure this is present and correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> // Renders your entire application
  </React.StrictMode>,
);