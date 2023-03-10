import { useQuery } from '@tanstack/react-query';
import Card from 'react-bootstrap/esm/Card';
import { Link, useParams } from 'react-router-dom';
import { getPostById } from './services/PostService';
import { getUserById } from './services/UserService';
import { PostFull } from './types/types';
import Image from 'react-bootstrap/Image';
import { formatDistanceToNow } from 'date-fns';

function PostDetails() {
  const { postId } = useParams();

  const postQuery = useQuery<PostFull>(
    ['myposts', parseInt(postId as string, 10)],
    () => getPostById(parseInt(postId as string, 10))
  );

  const userQuery = useQuery({
    queryKey: ['users', postQuery.data?.authorId],
    enabled: postQuery.data?.authorId != null,
    queryFn: () =>
      postQuery.data?.authorId
        ? getUserById(postQuery.data?.authorId)
        : Promise.reject(new Error('Invalid id')),
  });

  if (!postId || isNaN(+postId)) {
    return <pre>Invalid post id</pre>;
  }

  if (postQuery.isLoading) return <h1>Loading...</h1>;
  if (postQuery.isError)
    return <pre>{JSON.stringify(`Error: ${postQuery.error}`)}</pre>;

  return (
    <main className="container">
      <h1>PostDetails</h1>
      <Card>
        <Card.Img
          variant="top"
          src={postQuery.data.imgUrl || ''}
          alt="Post Background Image"
        />
        <Card.Body>
          {userQuery.isLoading ? (
            <small>Loading author...</small>
          ) : userQuery.isError ? (
            <small>Error loading author data</small>
          ) : (
            <div className="row">
              <div className="col-1 pe-0">
                <Link to={`/users/${userQuery.data.id}`}>
                  <Image
                    src={userQuery.data.imgUrl || ''}
                    alt="User Avatar"
                    roundedCircle
                    fluid
                    className="border border-2 border-dark border-opacity-50"
                  />
                </Link>
              </div>
              <div className="col">
                <p className="d-inline">by </p>
                <Link
                  to={`/users/${userQuery.data.id}`}
                  className="link-dark"
                >
                  {userQuery.data.username}
                </Link>
                <p>
                  {formatDistanceToNow(postQuery.data.createdDate)}{' '}
                  ago
                </p>
              </div>
            </div>
          )}
          <h2 className="fw-bolder mt-2">{postQuery.data.title}</h2>
          <div className="ms-2">
            {postQuery.data.tags.map((tag) => (
              <Link
                to={`/posts/tagged/${tag.name}`}
                key={tag.name}
                className="me-3 link-dark"
              >{`#${tag.name}`}</Link>
            ))}
          </div>
          <p className="mt-4">{postQuery.data.content}</p>
        </Card.Body>
      </Card>
    </main>
  );
}

export default PostDetails;
