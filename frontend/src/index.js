import { ApolloProvider } from "@apollo/client";
import ApolloClient from "apollo-boost";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// create client instance
const client = new ApolloClient({ 
  uri: 'http://localhost:4000/graphql', 
})

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();
