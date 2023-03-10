import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'react-router-dom';
import PostCardNoAuthor from './PostCardNoAuthor';
import { getPostsByUser } from './services/PostService';
import { getUserById } from './services/UserService';
import { PostWithTags, User } from './types/types';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/esm/Card';
import Container from 'react-bootstrap/esm/Container';

function UserDetails() {
  const { userId } = useParams();

  const userQuery = useQuery<User>(['user', userId], () =>
    getUserById(parseInt(userId as string, 10))
  );

  const postsQuery = useQuery<PostWithTags[]>({
    queryKey: ['posts-by-user', userId],
    queryFn: () => getPostsByUser(parseInt(userId as string, 10)),
  });

  if (!userId) {
    return <pre>Invalid user id</pre>;
  }
  if (userQuery.isLoading) return <h1>Loading...</h1>;
  if (userQuery.isError)
    return <pre>{JSON.stringify(`Error: ${userQuery.error}`)}</pre>;

  return (
    <main className="container">
      <h1>UserDetails</h1>
      <Card>
        <Card.Body>
          <Container className="text-center">
            <Image
              src={
                userQuery.data.imgUrl ||
                `https://ui-avatars.com/api/?name=${userQuery.data.realname}`
              }
              alt="User Avatar"
              roundedCircle
              fluid
              className="border border-2 border-dark border-opacity-50"
            />
            <h2>{userQuery.data.username}</h2>
            <small>{userQuery.data.realname}</small>
            <p>{userQuery.data.bio}</p>
            <p>{userQuery.data.email}</p>
            <p>{userQuery.data.website}</p>
            <p>
              Joined {formatDistanceToNow(userQuery.data.joinedDate)}{' '}
              ago
            </p>
          </Container>
        </Card.Body>
      </Card>

      <h3 className="mt-5">Posts by {userQuery.data.username}</h3>
      <ul className="list-unstyled">
        {postsQuery.isLoading
          ? 'Loading posts...'
          : postsQuery.isError
          ? 'Error loading posts'
          : postsQuery.data.map((post) => (
              <li key={post.id} className="mb-2">
                <PostCardNoAuthor post={post} />
              </li>
            ))}
      </ul>
    </main>
  );
}

export default UserDetails;
