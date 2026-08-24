import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  // Without this axios waits forever (its default is 0), so anything that stops
  // the API from answering — a wedged request, a stalled SMTP round-trip, the
  // wrong process on the port — leaves the calling button spinning with no
  // error. 30s clears the slowest legitimate route: POST /users/forgot-password
  // blocks on Gmail because it sends the mail before rewriting the password.
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-token'] = token;
  }
  return config;
});

export default api;
