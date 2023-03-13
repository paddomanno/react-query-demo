import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getPostsByTagPaginated } from './services/PostService';
import PostCard from './PostCard';
import { useParams } from 'react-router-dom';
import { PostsPaginatedResponse } from './types/types';
import Button from 'react-bootstrap/esm/Button';

function PostListByTag() {
  const { tag } = useParams();
  const LIMIT = 3;
  const [page, setPage] = useState(1);

  const postsQuery = useQuery<PostsPaginatedResponse>({
    queryKey: ['myposts', tag, { page }],
    keepPreviousData: true, // show old data instead of 'loading' while fetching
    queryFn: () =>
      tag
        ? getPostsByTagPaginated(tag, page, LIMIT)
        : Promise.reject(new Error('Invalid id')),
  });

  if (!tag) {
    return <pre>Invalid tag name</pre>;
  }
  // if (postsQuery.isLoading) return <h1>Loading...</h1>;
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
    <main className="container">
      <h1>
        PostListByTag{' '}
        <small className="text-muted">(Pagination Demo)</small>
      </h1>
      <p>
        {postsQuery.isLoading ? (
          <div
            className="skeleton skeleton-text"
            style={{ width: '3rem', display: 'inline' }}
          ></div>
        ) : (
          postsQuery.data.total
        )}{' '}
        posts published with the tag <strong>#{tag}</strong>
      </p>
      <Button
        disabled={postsQuery.data && !postsQuery.data.previousPage}
        onClick={prevPage}
        className="me-2"
      >
        Previous
      </Button>
      <Button
        disabled={postsQuery.data && !postsQuery.data.nextPage}
        onClick={nextPage}
      >
        Next
      </Button>
      <ul className="list-unstyled mt-3">
        {postsQuery.isLoading
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="mb-2">
                <PostCard.Skeleton />
              </li>
            ))
          : postsQuery.data.posts.map((post) => (
              <li key={post.id} className="mb-2">
                {postsQuery.isPreviousData ? (
                  <PostCard.Skeleton />
                ) : (
                  <PostCard post={post} />
                )}
              </li>
            ))}
      </ul>
      <Button
        disabled={postsQuery.data && !postsQuery.data.previousPage}
        onClick={prevPage}
        className="me-2"
      >
        Previous
      </Button>
      <Button
        disabled={postsQuery.data && !postsQuery.data.nextPage}
        onClick={nextPage}
      >
        Next
      </Button>
      {postsQuery.isLoading ? (
        <div
          className="skeleton skeleton-text"
          style={{ width: '5rem', display: 'inline' }}
        ></div>
      ) : (
        <p>
          Showing posts {(page - 1) * LIMIT + 1}-
          {Math.min(page * LIMIT, postsQuery.data.total)} of{' '}
          {postsQuery.data.total}
        </p>
      )}
      <small>{postsQuery.isPreviousData && 'Loading...'}</small>
    </main>
  );
}

export default PostListByTag;
