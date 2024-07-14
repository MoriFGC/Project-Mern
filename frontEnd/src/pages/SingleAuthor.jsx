import { useParams } from 'react-router-dom';
import { getAuthorId, getPostAuthor } from '../services/Api';
import { useEffect, useState } from 'react';
import Post from '../components/Post';

export default function SingleAuthor() {
    const [author, setAuthor] = useState([])
    const [posts, setposts] = useState([])
    const {id} = useParams();


    useEffect(() => {
        fetchAuthor();
    }, [id]);

    useEffect(() => {
        if (author) {
            fetchPosts()
        }
    },[author])

    const fetchPosts = async () => {
        try {
            const response = await getPostAuthor(author.email);
            setposts(response.data)
            console.log(posts);
            
        } catch (error) {
            console.error('no post', error)
        }
    };

    const fetchAuthor = async () => {
        try {
            const response = await getAuthorId(id);
            setAuthor(response.data)
        } catch (error) {
            console.error('no utente', error)
        }
    };


  return (
    <div className='flex flex-col items-center min-h-screen mb-10 text-white'>
        <div className='drop-shadow-2xl  mx-auto flex flex-col justify-center items-center gap-4 text-center text-white rounded-full my-5'>
            <div className='border-2 border-verde h-[200px] w-[200px] rounded-full ms-4'>
                <img className='rounded-full'
                 src={author.avatar} alt={author.nome} />
            </div>
            <div>
                <h2 className='text-2xl font-semibold font-mono'>{author.nome} {author.cognome}</h2>
                <p className='text-xl font-mono'>Birth Date: {author.dataDiNascita}</p>
                <p className='text-xl font-mono'>Email: {author.email}</p>
            </div>
        </div>
        {/* TO DO stampo tutti i post specifici nella pagina */}
        <h3 className='text-2xl font-mono font-semibold'>Posts Of This Author</h3>
        <Post posts={posts}/>
    </div>
  )
}
