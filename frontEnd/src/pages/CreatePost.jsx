// Importa useState hook da React
import { useEffect, useState } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo la funzione createPost dal mio file services/api
import { createPost, getMe } from '../services/Api'


export default function CreatePost() {

  const [error, setError] = useState('');

  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Nuovo stato per gestire il file di copertina
  const [coverFile, setCoverFile] = useState(null);

  // Hook per la navigazione
  const navigate = useNavigate();

  // NEW! useEffect per l'autenticazione
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
        console.log(userData);
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  // Nuovo gestore per il cambiamento del file di copertina
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('The file is too big');
      } else {
        setError('');
        setCoverFile(file);
      }
    }
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      Object.keys(post).forEach(key => {
        if (key === 'readTime') {
          formData.append('readTime[value]', post.readTime.value);
          formData.append('readTime[unit]', post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });
  
      if (coverFile) {
        formData.append('cover', coverFile);
      }
  
      const response = await createPost(formData);
      
      console.log("Risposta del server:", response);
  
      if (response && response.data) {
        console.log("Post creato con successo:", response.data);
        navigate("/");
      } else {
        throw new Error("Risposta del server non valida");
      }
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
      if (error.response) {
        console.log("Dati della risposta:", error.response.data);
        console.log("Status:", error.response.status);
        console.log("Headers:", error.response.headers);
      }
      // Qui puoi aggiungere un messaggio di errore per l'utente
    }
  };



  // Template del componente
  return (
    <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 mt-32">
    <div className="max-w-md w-full space-y-8">
      <div className="bg-transparent p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-1">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              value={post.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-white mb-1">Cover Image</label>
            <input
              id="cover"
              type="file"
              name="cover"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <label htmlFor="readTimeValue" className="block text-sm font-medium text-white mb-1">Read Time (minutes)</label>
            <input
              id="readTimeValue"
              type="number"
              name="readTimeValue"
              value={post.readTime.value}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-white mb-1">Author Email</label>
            <input
              id="author"
              type="email"
              name="author"
              value={post.author}
              readOnly
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white mb-1">Content</label>
            <textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500 h-32"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-verde text-white py-2 rounded hover:bg-green-700 transition duration-300"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  </div>
    
  );
}