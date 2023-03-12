import axios from 'axios';
import {
  NewPost,
  PostFull,
  PostsPaginatedResponse,
  PostWithTags,
} from '../types/types';

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

export async function getPostsPaginated(
  page: number,
  limit: number,
  sortBy: string
): Promise<PostsPaginatedResponse> {
  try {
    const response = await axios.get<PostFull[]>(API_URL + '/posts', {
      params: {
        _page: page,
        _sortBy: sortBy,
        _limit: limit,
      },
    });
    response.data.map((post) => {
      post.createdDate = new Date(post.createdDate);
    });
    const hasNext =
      page * limit < parseInt(response.headers['x-total-count']);
    return {
      total: parseInt(response.headers['x-total-count']),
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
      posts: response.data,
    };
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

/**
 * Not used, using paginated version instead
 */
export async function getPostsByTag(
  tag: string
): Promise<PostFull[]> {
  try {
    const response = await axios.get<PostFull[]>(
      `${API_URL}/posts/tagged/${tag}`
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

export async function getPostsByTagPaginated(
  tag: string,
  page: number,
  limit: number
): Promise<PostsPaginatedResponse> {
  try {
    const response = await axios.get<PostFull[]>(
      `${API_URL}/posts/tagged/${tag}`,
      {
        params: {
          _page: page,
          _sortBy: 'createdDate',
          _limit: limit,
        },
      }
    );
    response.data.map((post) => {
      post.createdDate = new Date(post.createdDate);
    });
    const hasNext =
      page * limit < parseInt(response.headers['x-total-count']);
    return {
      total: parseInt(response.headers['x-total-count']),
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
      posts: response.data,
    };
  } catch (e) {
    console.error('Error fetching posts: ' + e);
    throw e;
  }
}

export async function createPost(post: NewPost): Promise<PostFull> {
  try {
    const response = await axios.post<PostFull>(
      `${API_URL}/posts`,
      post
    );
    return response.data;
  } catch (e) {
    console.error('Error creating post: ' + e);
    throw e;
  }
}
