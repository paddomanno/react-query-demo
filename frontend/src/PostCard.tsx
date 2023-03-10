import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { PostFull } from './types/types';
import Image from 'react-bootstrap/Image';

type Props = {
  post: PostFull;
};

function PostCard({ post }: Props) {
  return (
    <div className="card pb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-1 pe-0">
            <Link to={`/users/${post.author.id}`}>
              <Image
                src={post.author.imgUrl || ''}
                alt="User Avatar"
                roundedCircle
                fluid
                className="border border-2 border-dark border-opacity-50"
              />
            </Link>
          </div>
          <div className="col">
            <div>
              <p className="d-inline">by </p>
              <Link
                to={`/users/${post.author.id}`}
                className="link-dark"
              >
                {post.author.username}
              </Link>
              <p>{formatDistanceToNow(post.createdDate)} ago</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="offset-1">
            <Link
              to={`/posts/${post.id}`}
              className="link-dark text-decoration-none"
            >
              <h2 className="fw-bolder">{post.title}</h2>
            </Link>
            <div>
              {post.tags.map((tag) => (
                <Link
                  to={`/posts/tagged/${tag.name}`}
                  key={tag.name}
                  className="me-3 link-dark"
                >{`#${tag.name}`}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
