import { ApolloProvider, InMemoryCache } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { persistCache } from 'apollo-cache-persist';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage
})

// check chache in lodal storage
if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  cache.restore(cacheData)
}

// create client instance
const client = new ApolloClient({ 
  cache,
  uri: 'http://localhost:4000/graphql', 
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem('token')
      }
    }))
}
})

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();
