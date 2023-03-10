import PostList from './PostList';
import { Route, Routes, Link } from 'react-router-dom';
import PostDetails from './PostDetails';
import UserDetails from './UserDetails';
import PostListByTag from './PostListByTag';
import NewPostForm from './NewPostForm';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './custom.css';

export default function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-2">
        <Container className="justify-content-start">
          <Link to="/" className="navbar-brand">
            Dev Blog
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/posts/new" className="nav-link">
                New Post
              </Link>
            </li>
          </ul>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/users/:userId" element={<UserDetails />} />
        <Route path="/posts/new" element={<NewPostForm />} />
        <Route
          path="/posts/tagged/:tag"
          element={<PostListByTag />}
        />
      </Routes>
    </>
  );
}
