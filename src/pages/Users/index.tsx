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

  const addUserMutation = useMutation<
    User[],
    UserAlreadyExistsError | Error,
    User,
    { previousUsers: User[] }
    >(async (user) => {
    const response = await addUser(user);

    if (response.status === 409) {
      throw new UserAlreadyExistsError('User exists')
    }

    return response.json();
  }, {
    onMutate: async (newUser) => {
      await queryClient.cancelQueries('users');

      const previousUsers: User[] = queryClient.getQueryData('users') ?? [];

      queryClient.setQueryData('users', (old: User[] | undefined) =>
        [...(old ?? []), newUser]);

      return { previousUsers };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'], {
        refetchActive: true,
        refetchInactive: false
      });
    },
    onError: (error, user, context) => {
      queryClient.setQueryData('users', context?.previousUsers ?? [])
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
