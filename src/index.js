import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';

import Store from './store';

// Store.dispatch({ type: "account/deposit", payload: 1000 })
// Store.dispatch({ type: "customer/createCustomer", payload: { fullName: "Karthik", nationalID: "fwuydt", createdAt: new Date().toISOString() } })
// console.log(Store.getState())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);

