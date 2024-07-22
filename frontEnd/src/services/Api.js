import axios from 'axios';

const API_URL = 'https://project-mern-3pf8.onrender.com/api' || 'http://localhost:5001/api';
const api = axios.create({baseURL: API_URL});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPosts = (currentPage, title = '') => api.get('/blogPosts', {
  params: { page: currentPage, title: title }
});
export const getPostAuthor = (email) => api.get(`/blogPosts/author/${email}`);
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post("/blogPosts", postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePost = (postData, id) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

export const getAuthors = (currentPage, limit) => api.get('/authors', {
  params: { page: currentPage, limit: limit }
});
export const getAuthorEmail = (email) => api.get(`/authors/mail/${email}`);
export const getAuthorId = (id) => api.get(`/authors/${id}`);
export const createAuthor = (postData) => api.post("/authors", postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateAuthor = (postData, id) => api.put(`/authors/${id}`, postData);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

export const getComments = (postId) => api.get(`/blogPosts/${postId}/comments`).then(response => response.data);
export const addComment = (postId, commentData) => api.post(`/blogPosts/${postId}/comments`, commentData).then(response => response.data);
export const getComment = (postId, commentId) => api.get(`/blogPosts/${postId}/comments/${commentId}`).then(response => response.data);
export const updateComment = (postId, commentId, commentData) => api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData).then(response => response.data);
export const deleteComment = (postId, commentId) => api.delete(`/blogPosts/${postId}/comments/${commentId}`).then(response => response.data);

export const registerUser = (userData) => {
  console.log("Dati inviati al server:", userData);
  return api.post("/authors", userData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("Risposta API login:", response.data);
    return response.data;
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error);
    throw error;
  }
};

export const getMe = () => api.get("/auth/me").then(response => response.data);

export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error);
    throw error;
  }
};

export default api;