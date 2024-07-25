import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getPosts, getAuthorEmail, getMe } from '../services/Api';
import Post from '../components/Post';
import Pagination from '../components/Pagination';

export default function Home() {
    // Variabili di stato per gestire la paginazione, i post, la ricerca, lo stato di caricamento, lo stato di login, le informazioni dell'autore e i dati dell'utente
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [posts, setPosts] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [author, setAuthor] = useState(null);
    const [userData, setUserData] = useState(null);

    // Hook per navigare programmaticamente
    const navigate = useNavigate();

    // Effetto per controllare lo stato di login al montaggio del componente e quando cambia localStorage
    useEffect(() => {
        const checkLoginStatus = () => {
          const token = localStorage.getItem("token");
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          setIsLoggedIn(!!token); // Imposta lo stato di login in base alla presenza del token
          setUserData(storedUserData); // Imposta i dati dell'utente da localStorage
        };
    
        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus); // Ascolta i cambiamenti di storage
    
        return () => {
          window.removeEventListener("storage", checkLoginStatus); // Rimuove il listener al dismontaggio
        };
    }, []);
    
    // Funzione per recuperare i post in base alla pagina corrente e al titolo di ricerca
    const fetchPosts = async () => {
        try {
            setIsLoading(true); // Imposta lo stato di caricamento a true
            const response = await getPosts(currentPage, searchTitle); // Recupera i post dall'API
            setPosts(response.data.posts); // Imposta lo stato dei post con i dati recuperati
            setTotalPages(response.data.totalPages); // Imposta lo stato delle pagine totali con i dati recuperati
        } catch(err) {
            console.error('Errore nella richiesta dei post', err); // Logga l'errore se la richiesta fallisce
        } finally {
            setIsLoading(false); // Imposta lo stato di caricamento a false
        }
    }

    // Funzione per recuperare le informazioni dell'autore in base all'email dell'utente
    const fetchAuthor = async () => {
        if (userData && userData.email) {
            try {
                const response = await getAuthorEmail(userData.email); // Recupera le informazioni dell'autore dall'API
                if (response && response.data) {
                    setAuthor(response.data); // Imposta lo stato dell'autore con i dati recuperati
                } else {
                    console.error("Dati dell'autore non validi"); // Logga l'errore se i dati sono invalidi
                }
            } catch (error) {
                console.error("Errore nella richiesta dell'autore", error); // Logga l'errore se la richiesta fallisce
            }
        }
    };

    // Effetto per recuperare le informazioni dell'autore quando i dati dell'utente cambiano
    useEffect(() => {
        fetchAuthor();
    }, [userData]);

    // Effetto per recuperare i post quando la pagina corrente o il titolo di ricerca cambiano
    useEffect(() => {
        fetchPosts();
    }, [currentPage, searchTitle]);

    // Reindirizza alla pagina di login se non si è loggati
    if (!isLoggedIn) {
        navigate("/login");
        return null;
    }

    return (
        <main className='px-12 mb-32 mt-40 min-h-screen max-w-7xl mx-auto relative'>
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='text-[30px] font-bold font-mono text-black dark:text-white'>
                    Welcome To My Blog, <span className='text-verde'>{author ? `${author.nome} ${author.cognome}` : 'User'}</span>
                </h1>
                <input 
                    type="search" 
                    placeholder='Search Post...'
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className='border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white'
                />
            </div>

            <Post posts={posts} isLoading={isLoading}/>
            <Pagination 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                totalPages={totalPages} 
            />
        </main>
    )
}