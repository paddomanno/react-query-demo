import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostById } from './services/PostService';
import { getUserById } from './services/UserService';
import { PostFull } from './types/types';

type Props = {};

function PostDetails({}: Props) {
  const { postId } = useParams();

  if (!postId || isNaN(+postId)) {
    return <pre>Invalid post id</pre>;
  }

  const postQuery = useQuery<PostFull>(
    ['myposts', parseInt(postId as string, 10)],
    () => getPostById(parseInt(postId as string, 10))
  );

  const userQuery = useQuery({
    queryKey: ['users', postQuery.data?.authorId],
    enabled: postQuery.data?.authorId != null,
    queryFn: () => getUserById(postQuery.data?.authorId!),
  });

  if (postQuery.isLoading) return <h1>Loading...</h1>;
  if (postQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postQuery.error}`)}</pre>;

  return (
    <main>
      <h1>PostDetails</h1>
      <h2>{postQuery.data.title}</h2>
      <div>
        {postQuery.data.tags.map((tag) => (
          <Link
            to={`/posts/tagged/${tag.name}`}
            key={tag.name}
          >{`#${tag.name}`}</Link>
        ))}
      </div>
      <small>
        {userQuery.isLoading ? (
          'Loading author...'
        ) : userQuery.isError ? (
          'Error loading author data'
        ) : (
          <>
            Written by
            <Link to={`/users/${userQuery.data.id}`}>
              {userQuery.data.username}
            </Link>
            <Link to={`/users/${userQuery.data.id}`}>
              <img
                src={userQuery.data.imgUrl || ''}
                alt="User Avatar"
              />
            </Link>
          </>
        )}
      </small>
      <img
        src={postQuery.data.imgUrl || ''}
        alt="Post Background Image"
      />
      <p>{postQuery.data.content}</p>
    </main>
  );
}

export default PostDetails;
