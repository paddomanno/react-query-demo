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
      <p>{post.author.username}</p>
    </div>
  );
}

export default PostCard;
