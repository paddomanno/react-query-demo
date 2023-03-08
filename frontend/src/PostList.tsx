import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  getAllPosts,
  getPostsPaginated,
} from './services/PostService';
import PostCard from './PostCard';
import { PostsPaginatedResponse } from './types/types';

type Props = {};

function PostList({}: Props) {
  const postsQuery = useInfiniteQuery<PostsPaginatedResponse>({
    queryKey: ['myposts'],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPostsPaginated(pageParam, 3, 'createdDate'), // pageParam is returned by getNextPageParam
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  return (
    <main>
      <h1>PostList (Infinite Scroll Demo)</h1>
      <ul>
        {postsQuery.data.pages
          .flatMap((pageData) => pageData.posts)
          .map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
      </ul>
      {postsQuery.hasNextPage ? (
        <button onClick={() => postsQuery.fetchNextPage()}>
          {postsQuery.isFetchingNextPage ? 'Loading...' : 'Show more'}
        </button>
      ) : (
        <p>No more posts</p>
      )}
    </main>
  );
}

export default PostList;
