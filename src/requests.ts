import { CommentsResponse, User, UsersResponse } from './types';

const API_URL = 'http://localhost:3001';

export const fetchUsers = async (): Promise<UsersResponse> => {
  const response = await fetch(`${API_URL}/users`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

  return response.json();
}

export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

  return response.json();
}

export const addUser = async (user: User) => {
  return fetch(`${API_URL}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user }),
    });
}

export const fetchComments = async (offset: number = 0, limit: number = 100): Promise<CommentsResponse> => {
  const response = await fetch(`${API_URL}/comments?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

  return response.json();
}
