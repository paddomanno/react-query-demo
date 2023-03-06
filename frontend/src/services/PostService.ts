import axios from 'axios';
import { PostFull } from '../types/types';

// const API_URL = process.env['VITE_API_BASE_URL'];
const API_URL = 'http://localhost:7000/api';

export async function getAllPosts(): Promise<PostFull[]> {
  try {
    const response = await axios.get<PostFull[]>(API_URL + '/posts');
    return response.data;
  } catch (e) {
    console.error('Error fetching posts: ' + e);
    throw e;
  }
}
