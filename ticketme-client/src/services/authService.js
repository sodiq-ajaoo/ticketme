import api from './api';

// Register
export async function registerUser(userData) {
  const res = await api.post('/users/signup', userData);

  // Automatically log user in after signup
  if (res.data.token) {
    localStorage.setItem('jwt', res.data.token);

    localStorage.setItem('user', JSON.stringify(res.data.data.user));
  }

  return res.data;
}

// Login
export async function loginUser(email, password) {
  const res = await api.post('/users/login', {
    email,
    password,
  });

  // Save JWT
  if (res.data.token) {
    localStorage.setItem('jwt', res.data.token);

    localStorage.setItem('user', JSON.stringify(res.data.data.user));
  }

  return res.data;
}

// Logout
export function logoutUser() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
}

// Helpers
export function getToken() {
  return localStorage.getItem('jwt');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');

  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem('jwt');
}
