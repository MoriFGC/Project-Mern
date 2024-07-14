// Importa useState hook da React
import { useEffect, useState } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo la funzione createPost dal mio file services/api
import { createPost, getMe } from '../services/Api'


export default function CreatePost() {
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
    <div className="flex flex-col min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md mx-auto mt-[50px]">
    <h1 className="text-3xl mb-6 font-mono text-center">Create New Post</h1>
    
    <div className='flex flex-col gap-4'>
      <div className="flex flex-col">
        <label htmlFor="title" className="mb-1 font-semibold">Title</label>
        <input 
          id="title"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="flex flex-col">
        <label htmlFor="category" className="mb-1 font-semibold">Category</label>
        <input 
          id="category"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="text"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="flex flex-col">
        <label htmlFor="cover" className="mb-1 font-semibold">Cover Image</label>
        <input 
          id="cover"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="file"
          name="cover"
          onChange={handleFileChange}
          required
        />
      </div>
  
      <div className="flex flex-col">
        <label htmlFor="readTimeValue" className="mb-1 font-semibold">Read Time (minutes)</label>
        <input 
          id="readTimeValue"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="number"
          name="readTimeValue"
          value={post.readTime.value}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="flex flex-col">
        <label htmlFor="author" className="mb-1 font-semibold">Author Email</label>
        <input 
          id="author"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          type="email"
          name="author"
          value={post.author}
          readOnly
        />
      </div>
  
      <div className="flex flex-col">
        <label htmlFor="content" className="mb-1 font-semibold">Content</label>
        <textarea 
          id="content"
          className='px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32'
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        />
      </div>
  
      <button type="submit" className="mt-4 text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold  font-mono hover:text-white hover:bg-stone-950 rounded-lg p-3 transition duration-300 ease-in-out">
        Create Post
      </button>
    </div>  
  </form>
    </div>
    
  );
}