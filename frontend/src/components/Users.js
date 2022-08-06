import { Query } from '@apollo/client/react/components';
import React from 'react';
import { ROOT_QUERY } from './App';
// import { gql } from 'apollo-boost'

/**
 * Users component
 */
const Users = () => {
      <Query query={ROOT_QUERY}>
            {result => (
                  <p>Users are loading: {result.loading ? "yes" : "no"}</p>
            )}
      </Query>
};

export default Users; 