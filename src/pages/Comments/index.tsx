import React, { FC, useEffect } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { fetchComments, fetchUsers } from '../../requests';
import CommentItem from './CommentItem';

const PAGE_SIZE = 5;

const Comments: FC = () => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery('usersIds', async () => {
    const usersResponse = await fetchUsers();

    return usersResponse.users.map(user => {
      queryClient.setQueryData(['users', user.id], user);

      return user.id;
    })
  });

  const { isFetchingNextPage, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
    'comments',
    async ({ pageParam }) => {
      const offset = pageParam ?? 0;
      const { comments } = await fetchComments(offset, PAGE_SIZE);

      return {
        comments,
        offset,
        limit: PAGE_SIZE,
      };
    }, {
      getNextPageParam: (lastPage, allPages) => {
        // if returns undefined, hasNextPage is false
        
        return lastPage.comments.length ? lastPage.offset + PAGE_SIZE : lastPage.offset;
      },
    });

  useEffect(() => {
    fetchNextPage();
  }, []);

  const comments = data?.pages.map(commentResponse => commentResponse.comments).flat() ?? [];

  return (
    <div>
      <ul>
        {comments.map((comment) => {
          return <CommentItem comment={comment} key={comment.id} />;
        })}
      </ul>
      <div>
        <button onClick={() => fetchNextPage()}>Next</button>{" "}
        {isFetchingNextPage && <div>Fetching next page...</div>}
      </div>
    </div>
  );
};

export default Comments;
