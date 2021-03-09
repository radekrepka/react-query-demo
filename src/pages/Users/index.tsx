import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { fetchUsers } from '../../requests';

const Users: FC = () => {
  const { data, status } = useQuery('users', async () => {
    const response = await fetchUsers();

    return response.users;
  });

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>
          {user.name} ({user.id})
        </li>
      ))}
    </ul>
  );
};

export default Users;
