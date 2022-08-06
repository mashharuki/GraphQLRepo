import { gql, useMutation, useQuery } from '@apollo/client';
import React, { Fragment } from 'react';
import { ROOT_QUERY } from './App';

// Mutation
const ADD_FAKE_USERS_MUTATION = gql`
    mutation addFakeUsers($count:Int!) {
        addFakeUsers(count:$count) {  
            githubLogin
            name
            avatar
        }
    }
`

/**
 * UserListコンポーネント
 */
const UserList = ({ count, users, refetch }) => {
      // Pass mutation to useMutation
      const [mutateFunction, { data, loading, error }] = useMutation(ADD_FAKE_USERS_MUTATION);
      
      return (
            <div>
                  <p>{count} Users</p>
                  <button onClick={() => refetch()}>Refetch</button>
                  {data => {<button onClick={data}>Add Fake User</button>}}
                  <ul>
                        {users.map(user => 
                              <UserListItem 
                                    key={user.githubLogin} 
                                    name={user.name}
                                    avatar={user.avatar} 
                              />
                        )}
                  </ul>
            </div> 
      );
}

/**
 * UserListItem Component
 */
const UserListItem = ({ name, avatar }) => {
      return (
            <li>
                  <img src={avatar} width={48} height={48} alt="" />
                  {name}
            </li>
      );
}

/**
 * Users component
 */
const Users = () => {

      const { loading, error, data, refetch }  = useQuery(ROOT_QUERY);

      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
            <Fragment> 
                  <UserList 
                        count={data.totalUsers} 
                        users={data.allUsers} 
                        refetch={refetch} 
                  /> 
            </Fragment>
      );
};

export default Users; 