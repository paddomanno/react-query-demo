import axios from 'axios';
import { User } from '../types/types';

// const API_URL = process.env['VITE_API_BASE_URL'];
const API_URL = 'http://localhost:7000/api';

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await axios.get<User[]>(API_URL + '/users');
    return response.data;
  } catch (e) {
    console.error('Error fetching users: ' + e);
    throw e;
  }
}

export async function getUserById(id: number): Promise<User> {
  try {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    return response.data;
  } catch (e) {
    console.error('Error fetching users: ' + e);
    throw e;
  }
}
