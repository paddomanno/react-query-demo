import axios from 'axios';
import { PostFull, PostWithTags } from '../types/types';

// const API_URL = process.env['VITE_API_BASE_URL'];
const API_URL = 'http://localhost:7000/api';

export async function getAllPosts(): Promise<PostFull[]> {
  try {
    const response = await axios.get<PostFull[]>(API_URL + '/posts');
    response.data.map((post) => {
      post.createdDate = new Date(post.createdDate);
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching posts: ' + e);
    throw e;
  }
}

export async function getPostById(id: number): Promise<PostFull> {
  try {
    const response = await axios.get<PostFull>(
      `${API_URL}/posts/${id}`
    );
    response.data.createdDate = new Date(response.data.createdDate);
    return response.data;
  } catch (e) {
    console.error('Error fetching posts: ' + e);
    throw e;
  }
}

export async function getPostsByUser(
  userId: number
): Promise<PostWithTags[]> {
  try {
    const response = await axios.get<PostWithTags[]>(
      `${API_URL}/users/${userId}/posts`
    );
    response.data.map((post) => {
      post.createdDate = new Date(post.createdDate);
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching posts: ' + e);
    throw e;
  }
}
