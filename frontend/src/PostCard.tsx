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
          <span key={tag.name}>{`#${tag.name}`}</span>
        ))}
      </div>
      <p>{`Written by ${post.author.username}`}</p>
      <p>{post.createdDate.toUTCString()}</p>
    </div>
  );
}

export default PostCard;
