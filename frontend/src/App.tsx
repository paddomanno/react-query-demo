import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const POSTS = [
  { id: '1', title: 'Post 1' },
  { id: '2', title: 'Post 2' },
];

function App() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['myposts'],
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // queryFn: () => Promise.reject('Error fetching the posts'), // demonstrating error
  });

  const newPostMutation = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      );
    },
    onSuccess: () => queryClient.invalidateQueries(['myposts']),
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError)
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;

  // not loading, not error => success

  return (
    <div className="App">
      <h1>Hello World</h1>
      <div>
        {postsQuery.data.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate('New Post')}
      >
        Add Post
      </button>
    </div>
  );
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
