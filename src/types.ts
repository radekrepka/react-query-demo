export interface User {
  id: string;
  name: string;
}

export interface UsersResponse {
  users: User[];
  count: number;
}

export interface Comment {
  id: string;
  message: string;
  userId: User['id'];
}

export interface CommentsResponse {
  comments: Comment[];
}
