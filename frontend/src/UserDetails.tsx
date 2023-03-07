import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import PostCardNoAuthor from './PostCardNoAuthor';
import { getPostById, getPostsByUser } from './services/PostService';
import { getUserById } from './services/UserService';
import { PostFull, PostWithTags, User } from './types/types';

type Props = {};

function UserDetails({}: Props) {
  const { userId } = useParams();

  if (!userId) {
    return <pre>Invalid user id</pre>;
  }

  const userQuery = useQuery<User>(['user', userId], () =>
    getUserById(parseInt(userId as string, 10))
  );

  const postsQuery = useQuery<PostWithTags[]>({
    queryKey: ['posts', userId],
    queryFn: () => getPostsByUser(parseInt(userId as string, 10)),
  });

  if (userQuery.isLoading) return <h1>Loading...</h1>;
  if (userQuery.isError)
    return <pre>{JSON.stringify(`Error: ${userQuery.error}`)}</pre>;

  return (
    <main>
      <h1>UserDetails</h1>
      <h2>{userQuery.data.username}</h2>
      <img
        src={
          userQuery.data.imgUrl ||
          `https://ui-avatars.com/api/?name=${userQuery.data.realname}`
        }
        alt=""
      />
      <p>{userQuery.data.realname}</p>
      <p>{userQuery.data.email}</p>
      <p>{userQuery.data.website}</p>
      <p>{userQuery.data.joinedDate.toUTCString()}</p>
      <p>{userQuery.data.bio}</p>

      <p>Posts by {userQuery.data.username}</p>
      <ul>
        {postsQuery.isLoading
          ? 'Loading posts...'
          : postsQuery.isError
          ? 'Error loading posts'
          : postsQuery.data.map((post) => (
              <li key={post.id}>
                <PostCardNoAuthor post={post} />
              </li>
            ))}
      </ul>
    </main>
  );
}

export default UserDetails;
