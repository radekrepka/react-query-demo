import React, { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NotificationManager } from 'react-notifications';
import { addUser, fetchUsers } from '../../requests';
import UserForm from '../../components/UserForm';
import { User } from '../../types';
import { UserAlreadyExistsError } from '../../errors';

const Users: FC = () => {
  const queryClient = useQueryClient();
  const { data, status } = useQuery('users', async () => {
    const response = await fetchUsers();
    return response.users;
  });

  const addUserMutation = useMutation(async (user: User) => {
    const response = await addUser(user);

    if (response.status === 409) {
      throw new UserAlreadyExistsError('User exists')
    }

    return response.json();
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'], {
        refetchActive: true,
        refetchInactive: false
      });
    },
    onError: (error) => {
      if (error instanceof UserAlreadyExistsError) {
        NotificationManager.error('User already exists!')
      } else {
        NotificationManager.error('Error')
      }
    }
  });

  const handleAddUser = (id: string, name: string) => {
    addUserMutation.mutate({ id, name } );
  };

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div>
      <UserForm onSubmit={handleAddUser} />
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} ({user.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
