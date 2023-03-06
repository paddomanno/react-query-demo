import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAllPosts } from './services/PostService';
import PostCard from './PostCard';

type Props = {};

function PostList({}: Props) {
  const postsQuery = useQuery({
    queryKey: ['myposts'],
    queryFn: getAllPosts,
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  return (
    <main>
      <h1>PostList</h1>
      <ul>
        {postsQuery.data.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default PostList;
