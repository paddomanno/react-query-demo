import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from './services/PostService';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Button from 'react-bootstrap/esm/Button';

function NewPostForm() {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data /*, variables, context*/) => {
      // data = new post that was just created
      queryClient.setQueryData(['myposts', data.id], data); // put created post into cache
      queryClient.invalidateQueries(['myposts'], { exact: true }); // refetch main posts list
      navigate(`/posts/${data.id}`);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log('called');
    e.preventDefault();
    setValidated(true); // In any case, show validation results by setting validated to true
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // if form is invalid
      return;
    }

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
    <main className="container">
      <h1>NewPostForm</h1>
      {createPostMutation.isError &&
        JSON.stringify(createPostMutation.error)}
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <FormGroup className="mb-3">
          <FormLabel htmlFor="title">Title</FormLabel>
          <Form.Control
            type="text"
            size="lg"
            required
            id="title"
            ref={titleRef}
            placeholder="Cool Project Title 🔥"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please add a title
          </Form.Control.Feedback>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel htmlFor="content">Content</FormLabel>
          <Form.Control
            as="textarea"
            rows={3}
            required
            id="content"
            ref={contentRef}
            placeholder="About your project..."
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please add some content
          </Form.Control.Feedback>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel htmlFor="tags">Tags</FormLabel>
          <Form.Control
            type="text"
            required
            id="tags"
            ref={tagsRef}
            placeholder="tag1, tag2, tag3"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please add at least one tag
          </Form.Control.Feedback>
        </FormGroup>
        <Button type="submit" disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? 'Saving...' : 'Submit'}
        </Button>
      </Form>
    </main>
  );
}

export default NewPostForm;
