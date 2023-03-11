import axios from 'axios';
import { User } from '../types/types';

const API_URL = import.meta.env['VITE_API_BASE_URL'];
// const API_URL = 'http://localhost:7000/api';

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await axios.get<User[]>(API_URL + '/users');
    response.data.map((user) => {
      user.joinedDate = new Date(user.joinedDate);
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching users: ' + e);
    throw e;
  }
}

export async function getUserById(id: number): Promise<User> {
  try {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    response.data.joinedDate = new Date(response.data.joinedDate);
    return response.data;
  } catch (e) {
    console.error('Error fetching users: ' + e);
    throw e;
  }
}
