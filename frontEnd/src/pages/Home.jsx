import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getPosts, getAuthorEmail } from '../services/Api';
import Post from '../components/Post';
import Pagination from '../components/Pagination';

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [posts, setPosts] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [author, setAuthor] = useState(null);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
          const token = localStorage.getItem("token");
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          setIsLoggedIn(!!token);
          setUserData(storedUserData);
        };
    
        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);
    
        return () => {
          window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);
    
    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await getPosts(currentPage, limit, searchTitle);
            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch(err) {
            console.error('Errore nella richiesta dei post', err);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAuthor = async () => {
        if (userData && userData.email) {
            try {
                const response = await getAuthorEmail(userData.email);
                if (response && response.data) {
                    setAuthor(response.data);
                } else {
                    console.error("Dati dell'autore non validi");
                }
            } catch (error) {
                console.error("Errore nella richiesta dell'autore", error);
            }
        }
    };

    useEffect(() => {
        fetchAuthor();
    }, [userData]);

    useEffect(() => {
        fetchPosts();
    }, [currentPage, limit, searchTitle]);

    if (!isLoggedIn) {
        navigate("/login");
        return null;
    }

    return (
        <main className='px-12 mt-[30px] mb-5 min-h-screen'>
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='text-[30px] font-bold font-mono text-white'>
                    Welcome To My Blog, {author ? `${author.nome} ${author.cognome}` : 'User'}
                </h1>
                <input 
                    type="search" 
                    placeholder='Search Post...'
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className='border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent'
                />
            </div>

            <Post posts={posts} isLoading={isLoading}/>
            <Pagination 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                totalPages={totalPages} 
                setLimit={setLimit} 
                limit={limit}
            />
        </main>
    )
}