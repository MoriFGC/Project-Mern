import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPost, getAuthorEmail } from '../services/Api';
import { deletePost, updatePost } from '../services/Api';
import { DeleteCheck } from '../components/DeleteCheck';
import { UpdateModalPost } from '../components/UpdateModalPost';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';

export default function post() {
    //----------------------------------- use state per i post
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editPost, setEditPost] = useState({})
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const navigate = useNavigate()
    const [author, setAuthor] = useState([]);
    const [userData, setUserData] = useState(null);
    //-------------------- fetch e use effect

    useEffect(() => {
        const checkLoginStatus = () => {
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          setUserData(storedUserData);
        };
    
        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);
    
        return () => {
          window.removeEventListener("storage", checkLoginStatus);
        };
      }, []);

    useEffect(() => {
        fetchPost();
    }, [id]);
    
    useEffect(() => {
        if (post) {
            fetchAuthor();
        }
    }, [post]);
    
    const fetchPost = async () => {
        try {
            const response = await getPost(id);
            setPost(response.data);
        } catch (err) {
            console.error('Errore nella richiesta del post', err);
        }
    }
    
    const fetchAuthor = async () => {
        try {
            const response = await getAuthorEmail(post.author);
            setAuthor(response.data);
            console.log(author);
        } catch (error) {
            console.error("Errore nella richiesta dell'autore", error);
        }
    }

    if (!post) return <div>Caricamento...</div>;
//------------------------------------------------- DELETE
        // funzione per eliminare il post
    const handleDelete = async () => {
        try {
            await deletePost(id);
            navigate('/')
        } catch (error) {
            console.error('Error with the delete function', error);
        }
    }

    // funzione per far partire la modale di conferma eliminazione
    const deleteCheck = () => {
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
      }
//----------------------------------------------------- UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault
        try {
            await updatePost(editPost, id);
            setPost(
                post._id === id ? editPost : post
            );
            setIsEditing(false);
        } catch (error) {
            console.error('Error with the update function', error);
        }
    }

    return (
        <div className='mx-auto md:mt-[50px] h-dvh flex flex-col items-start mt-10 md:grid md:grid-cols-3 text-white'>
            <div className='hidden md:block'></div>
           <div className='flex flex-col items-center'>
                <img className="rounded-[20px] w-full mx-auto" src={post.cover} alt={post.title} />
            <div className='w-[70%] flex flex-col items-center'>
                <h1 className='text-center text-3xl mt-5 mb-2 font-mono'>{post.title}</h1>
                <div className='bg-verde w-full xl:w-[80%] rounded-lg'>
                    <p className='text-black font-mono p-3'>{post.content}.</p>
                </div>
            </div>
            {userData.email === post.author && (
                <div className='flex justify-center gap-3 mt-8'>
                    <button onClick={() => setEditPost(post)}
                        className="text-white bg-verde border-2 border-solid border-verde hover:text-white  hover:bg-black rounded-full p-2">
                        <PencilIcon className='w-[30px]'/>
                    </button>
                    <button onClick={deleteCheck}
                        className="text-white bg-[#ff0101] border-2 border-solid border-[#ff0101] font-bold hover:text-white hover:bg-black rounded-full p-2">
                        <TrashIcon className='w-[30px]'/>
                    </button>
                </div>
            )}
          </div> 
            
            <DeleteCheck 
              handleDelete={handleDelete} 
              id={id} 
              isOpen={showDeleteModal} 
              onClose={closeDeleteModal}
            />
            {editPost && editPost._id === post._id && (
                 <UpdateModalPost editPost = {editPost} setEditPost = {setEditPost} setIsEditing = {setIsEditing} handleUpdate = {handleUpdate} />
            )}
            {/* IMG Autore e email */}
            <Link to={`/author/${author._id}`}
            className='flex flex-col items-center gap-3 text-white hover:text-verde mt-10 md:mt-0 hover:drop-shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out'>
                <h2 className='text-2xl font-semibold font-mono'>Author</h2>
                <img className='rounded-full w-[30%]' src={author.avatar} alt={author.nome} />
                <h3 className='text-[20px] font-semibold font-mono'>{author.nome} {author.cognome}</h3>
            </Link>
        </div>
    )
}