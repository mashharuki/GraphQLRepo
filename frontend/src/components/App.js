//import { BrowserRouter } from 'react-router-dom'
//import AuthorizedUser from './AuthorizedUser'
import { gql } from 'apollo-boost';
import React from 'react';
import Users from './Users';

// GraphQL Query
export const ROOT_QUERY = gql`

    query allUsers {
        totalUsers        
        allUsers { ...userInfo }
        me { ...userInfo }
    }

    fragment userInfo on User {
        githubLogin
        name
        avatar
    }
`

/**
 * App Component
 */
function App() {
  return (
    <Users/>
  );
}

export default App;
