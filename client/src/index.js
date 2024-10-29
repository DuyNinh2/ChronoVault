import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './User/views/AppUser';
//import App from './Admin/views/App';
//import './Admin/styles/global.scss'
import reportWebVitals from './reportWebVitals';
//import './styles/global.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
