import React from 'react';
import { Link } from 'react-router-dom';
import { PostFull, PostWithTags } from './types/types';

type Props = {
  post: PostWithTags;
};

function PostCardNoAuthor({ post }: Props) {
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
      <p>{post.createdDate.toUTCString()}</p>
    </div>
  );
}

export default PostCardNoAuthor;
