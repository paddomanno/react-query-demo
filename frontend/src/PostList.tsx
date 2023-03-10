import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { getPostsPaginated } from './services/PostService';
import PostCard from './PostCard';
import { PostsPaginatedResponse } from './types/types';

function PostList() {
  const LIMIT = 5;
  const postsQuery = useInfiniteQuery<PostsPaginatedResponse>({
    queryKey: ['myposts'],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPostsPaginated(pageParam, LIMIT, 'createdDate'), // pageParam is returned by getNextPageParam
  });

  const intersectObserver = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
    // called when the last post is rendered
    (post: HTMLLIElement | null) => {
      if (postsQuery.isLoading) {
        return;
      }

      // attach an IntersectionObserver to the new last post
      // first disconnect from the previous last post
      if (intersectObserver.current) {
        intersectObserver.current.disconnect();
      }
      intersectObserver.current = new IntersectionObserver(
        (posts) => {
          // detect when the last post in the list is intersecting with the viewport
          if (posts[0].isIntersecting && postsQuery.hasNextPage) {
            postsQuery.fetchNextPage();
          }
        }
      );
      if (post) {
        intersectObserver.current.observe(post);
      }
    },
    [postsQuery]
  );

  // if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  return (
    <main className="container">
      <h1>
        PostList{' '}
        <small className="text-muted">(Infinite Scroll Demo)</small>
      </h1>
      {postsQuery.isLoading ? (
        Array.from({ length: LIMIT }, (_, i) => (
          <div key={i} className="mb-2">
            <PostCard.Skeleton />
          </div>
        ))
      ) : (
        <ul className="list-unstyled">
          {postsQuery.data.pages
            .flatMap((pageData) => pageData.posts)
            .map((post, index) => {
              // if this is the last post, attach the lastPostRef
              if (
                index ===
                postsQuery.data.pages.flatMap(
                  (pageData) => pageData.posts
                ).length -
                  1
              )
                return (
                  <li
                    ref={lastPostRef}
                    key={post.id}
                    className="mb-2"
                  >
                    <PostCard post={post} />
                  </li>
                );
              else
                return (
                  <li key={post.id} className="mb-2">
                    <PostCard post={post} />
                  </li>
                );
            })}
        </ul>
      )}
      {postsQuery.hasNextPage ? (
        // <button onClick={() => postsQuery.fetchNextPage()}>
        //   {postsQuery.isFetchingNextPage ? 'Loading...' : 'Show more'}
        // </button>
        postsQuery.isFetchingNextPage ? (
          <h2>Loading more posts...</h2>
        ) : (
          <small>Waiting for scrolling</small>
        )
      ) : (
        <p>No more posts</p>
      )}
    </main>
  );
}

export default PostList;
