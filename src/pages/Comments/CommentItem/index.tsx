import React, { FC } from 'react';
import { Comment } from '../../../types';
import { useQuery } from 'react-query';
import { fetchUser } from '../../../requests';

interface Props {
  comment: Comment;
}

const CommentItem: FC<Props> = ({ comment }) => {
  const { message, userId } = comment;

  const { data: user } = useQuery(['users', userId], () => fetchUser(userId), {
    staleTime: 5 * 60 * 1000
  });

  return (
    <li>
      <strong>{user?.name ?? 'Unknown user'}</strong>: {message}
    </li>
  )
};

export default CommentItem;
