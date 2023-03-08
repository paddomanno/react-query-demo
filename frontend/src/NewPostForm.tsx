import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from './services/PostService';

type Props = {};

function NewPostForm({}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data, variables, context) => {
      // data = new post that was just created
      queryClient.setQueryData(['myposts', data.id], data); // put created post into cache
      queryClient.invalidateQueries(['myposts'], { exact: true }); // refetch main posts list
      navigate(`/posts/${data.id}`);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !titleRef.current ||
      !contentRef.current ||
      !tagsRef.current
    ) {
      return;
    }

    const tagsInput = tagsRef.current.value;
    const tagNames = tagsInput
      .split(',')
      .map((tagName) => tagName.trim());

    const newPost = {
      title: titleRef.current.value,
      content: contentRef.current.value,
      authorId: 1,
      tags: tagNames.map((tagName) => ({ name: tagName })),
      imgUrl: null,
    };
    createPostMutation.mutate(newPost);
  }

  return (
    <div>
      <h1>NewPostForm</h1>
      {createPostMutation.isError &&
        JSON.stringify(createPostMutation.error)}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input required id="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <input required id="content" ref={contentRef} />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            required
            id="tags"
            ref={tagsRef}
            placeholder="tag1, tag2, tag3"
          />
        </div>
        <button disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default NewPostForm;
