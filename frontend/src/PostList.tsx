import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { getPostsPaginated } from './services/PostService';
import PostCard from './PostCard';
import { PostsPaginatedResponse } from './types/types';

function PostList() {
  const postsQuery = useInfiniteQuery<PostsPaginatedResponse>({
    queryKey: ['myposts'],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPostsPaginated(pageParam, 5, 'createdDate'), // pageParam is returned by getNextPageParam
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

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postsQuery.error}`)}</pre>;

  return (
    <main>
      <h1>PostList (Infinite Scroll Demo)</h1>
      <ol>
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
                <li ref={lastPostRef} key={post.id}>
                  <PostCard post={post} />
                </li>
              );
            else
              return (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              );
          })}
      </ol>
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
