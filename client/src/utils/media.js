const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const serverUrl = apiUrl.replace(/\/api\/?$/, '');

export const mediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${serverUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
