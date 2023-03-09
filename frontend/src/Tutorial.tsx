import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const POSTS = [
  { id: '1', title: 'Post 1' },
  { id: '2', title: 'Post 2' },
];

function Tutorial() {
  const queryClient = useQueryClient();

  // how to choose unique queryKey:
  // /posts -> ["posts"]
  // /posts/1 -> ["posts", post.id]
  // /posts?authorId=1 -> ["posts", { autherId: 1 }]
  // /posts/2/comments -> ["posts", post.id, "comments"]

  const postsQuery = useQuery({
    queryKey: ['myposts'],
    // queryFn: () => wait(1000).then(() => [...POSTS]),
    queryFn: (obj) =>
      wait(1000).then(() => {
        console.log(`running query with key ${obj.queryKey}`);
        return [...POSTS];
      }), // if you need to access query key
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
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>;

  // not loading, not error => success

  return (
    <div className="Tutorial App">
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

export default Tutorial;
