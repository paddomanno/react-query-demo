import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { PostWithTags } from './types/types';

type Props = {
  post: PostWithTags;
};

function PostCardNoAuthor({ post }: Props) {
  return (
    <div className="card pb-4">
      <div className="card-body">
        <p>{formatDistanceToNow(post.createdDate)} ago</p>
        <Link
          to={`/posts/${post.id}`}
          className="link-dark text-decoration-none"
        >
          <h2 className="fw-bolder">{post.title}</h2>
        </Link>
        <div className="ms-2">
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
  );
}

const Skeleton = () => {
  return (
    <div className="card pb-4">
      <div className="card-body">
        <div className="row">
          <div className="col">
            <div
              className="skeleton skeleton-text"
              style={{ height: '2rem' }}
            ></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

PostCardNoAuthor.Skeleton = Skeleton;

export default PostCardNoAuthor;
