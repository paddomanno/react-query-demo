import React from 'react';
import { Link } from 'react-router-dom';
import { PostFull } from './types/types';

type Props = {
  post: PostFull;
};

function PostCard({ post }: Props) {
  return (
    <div>
      <Link to={`/posts/${post.id}`}>
        <h2>{post.title}</h2>
      </Link>
      <div>
        {post.tags.map((tag) => (
          <Link
            to={`/posts/tagged/${tag.name}`}
            key={tag.name}
          >{`#${tag.name}`}</Link>
        ))}
      </div>
      <p>
        Written by
        <Link to={`/users/${post.author.id}`}>
          {post.author.username}
        </Link>
      </p>
      <Link to={`/users/${post.author.id}`}>
        <img src={post.author.imgUrl || ''} alt="User Avatar" />
      </Link>
      <p>{post.createdDate.toUTCString()}</p>
    </div>
  );
}

export default PostCard;
