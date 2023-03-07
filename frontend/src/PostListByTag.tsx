import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAllPosts, getPostsByTag } from './services/PostService';
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';
import { PostFull } from './types/types';

type Props = {};

function PostListByTag({}: Props) {
  const { tag } = useParams();

  if (!tag) {
    return <pre>Invalid tag name</pre>;
  }

  const postsQuery = useQuery<PostFull[]>({
    queryKey: ['myposts', tag],
    queryFn: () => getPostsByTag(tag),
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  return (
    <main>
      <h1>PostListByTag (Pagination Demo)</h1>
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

export default PostListByTag;
