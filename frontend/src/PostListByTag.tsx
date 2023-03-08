import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  getAllPosts,
  getPostsByTag,
  getPostsByTagPaginated,
} from './services/PostService';
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';
import { PostFull, PostsPaginatedResponse } from './types/types';

type Props = {};

function PostListByTag({}: Props) {
  const { tag } = useParams();
  const LIMIT = 3;

  if (!tag) {
    return <pre>Invalid tag name</pre>;
  }

  const [page, setPage] = useState(1);

  const postsQuery = useQuery<PostsPaginatedResponse>({
    queryKey: ['myposts', { page }],
    keepPreviousData: true, // show old data instead of 'loading' while fetching
    queryFn: () => getPostsByTagPaginated(tag, page, LIMIT),
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  function nextPage() {
    if (postsQuery.data?.nextPage) setPage(postsQuery.data?.nextPage);
  }
  function prevPage() {
    if (postsQuery.data?.previousPage)
      setPage(postsQuery.data?.previousPage);
  }

  return (
    <main>
      <h1>PostListByTag (Pagination Demo)</h1>
      <p>{postsQuery.data.total} posts published with this tag</p>
      <button
        disabled={!postsQuery.data.previousPage}
        onClick={prevPage}
      >
        Previous
      </button>
      <button disabled={!postsQuery.data.nextPage} onClick={nextPage}>
        Next
      </button>
      <ul>
        {postsQuery.data.posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <small>{postsQuery.isPreviousData && 'Loading...'}</small>
      <button
        disabled={!postsQuery.data.previousPage}
        onClick={prevPage}
      >
        Previous
      </button>
      <button disabled={!postsQuery.data.nextPage} onClick={nextPage}>
        Next
      </button>
      <p>
        Showing posts {(page - 1) * LIMIT + 1}-
        {Math.min(page * LIMIT, postsQuery.data.total)} of
        {postsQuery.data.total}
      </p>
    </main>
  );
}

export default PostListByTag;
