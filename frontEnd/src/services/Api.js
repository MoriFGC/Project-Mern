import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const api = axios.create({baseURL: API_URL});

// NEW! Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

export const getPosts = ( currentPage, limit, title = '') => api.get('/blogPosts', {
  params: {
    page: currentPage,
    limit: limit,
    title: title
  }
});
export const getPostAuthor = (email) => api.get(`/blogPosts/author/${email}`);
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post("/blogPosts", postData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const updatePost = (postData, id) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Se poi aggiungiamo operazioni sugli autori le mettiamo qua sotto

export const getAuthors = (currentPage, limit) => api.get('/authors', {
  params: {
    page: currentPage,
    limit: limit
  }
});
export const getAuthorEmail = (email) => api.get(`/authors/mail/${email}`);
export const getAuthorId = (id) => api.get(`/authors/${id}`);
export const createAuthor = (postData) => api.post("/authors", postData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const updateAuthor = (postData, id) => api.put(`/authors/${id}`, postData);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);
//-------------------------------------------------------------------------------

// NEW! Funzione per registrare un nuovo utente
export const registerUser = (userData) => api.post("/authors", userData);


// NEW: Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// NEW: Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

export default api;