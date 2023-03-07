import React from 'react';
import PostList from './PostList';
import { Route, Routes, Link } from 'react-router-dom';
import PostDetails from './PostDetails';
import UserDetails from './UserDetails';

export default function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/users/:userId" element={<UserDetails />} />
      </Routes>
    </>
  );
}
