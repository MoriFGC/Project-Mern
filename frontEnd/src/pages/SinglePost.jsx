import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getPost,
  getAuthorEmail,
  getComments,
  addComment,
  getMe,
} from "../services/Api";
import { deletePost, updatePost } from "../services/Api";
import { DeleteCheck } from "../components/DeleteCheck";
import { UpdateModalPost } from "../components/UpdateModalPost";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

export default function post() {
  //----------------------------------- use state per i post
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [author, setAuthor] = useState([]);
  const [userData, setUserData] = useState(null);
  // Stato per memorizzare i commenti
  const [comments, setComments] = useState([]);
  // Stato per il nuovo commento
  const [newComment, setNewComment] = useState("");
  //-------------------- use effects -----------------------

  // useEffect per l'autenticazione
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUserData(userData);
        console.log("User data:", userData);
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
      }
    };
    fetchUserData();
  }, []);

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
    fetchPostAndComments();
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchAuthor();
    }
  }, [post]);
  //--------------------- fetch autore, post e commenti ---------------------
  const fetchPostAndComments = async () => {
    try {
      const response = await getPost(id);
      setPost(response.data);

      // NEW: Fetch dei commenti
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      commentsResponse.forEach((comment) =>
        console.log("Comment ID:", comment._id)
      );
    } catch (err) {
      console.error("Errore nella richiesta del post o dei commenti", err);
    }
  };

  const fetchAuthor = async () => {
    try {
      const response = await getAuthorEmail(post.author);
      setAuthor(response.data);
      console.log(author);
    } catch (error) {
      console.error("Errore nella richiesta dell'autore", error);
    }
  };

  // Gestore per i cambiamenti nei campi del nuovo commento
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Gestore per l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      alert("Devi essere loggato per commentare.");
      return;
    }
    try {
      const commentData = {
        name: `${userData.nome} ${userData.cognome}`,
        email: userData.email,
        content: newComment,
      };
      await addComment(id, commentData);
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      setNewComment("");
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  if (!post) return <div>Caricamento...</div>;
  //------------------------------------------------- DELETE
  // funzione per eliminare il post
  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error with the delete function", error);
    }
  };

  // funzione per far partire la modale di conferma eliminazione
  const deleteCheck = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  //----------------------------------------------------- UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault;
    try {
      await updatePost(editPost, id);
      setPost(post._id === id ? editPost : post);
      setIsEditing(false);
    } catch (error) {
      console.error("Error with the update function", error);
    }
  };

  return (
    <div className="mx-auto md:mt-[50px] min-h-screen flex flex-col items-start mt-10 md:grid md:grid-cols-3 text-white">
      <div className="hidden md:block"></div>
      {/* Post e cover */}
      <div className="flex flex-col items-center">
        <img
          className="rounded-[20px] w-full mx-auto"
          src={post.cover}
          alt={post.title}
        />
        <div className="w-[70%] flex flex-col items-center">
          <h1 className="text-center text-3xl mt-5 mb-2 font-mono">
            {post.title}
          </h1>
          <div className="bg-verde w-full xl:w-[80%] rounded-lg">
            <p className="text-black font-mono p-3">{post.content}.</p>
          </div>
        </div>
        {/* FINE POST E COVER */}
        {/* Se l'email dell'utente loggato è uguale all'email dell'autore del post, mostra i pulsanti per modificare e eliminare il post */}
        {userData.email === post.author && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setEditPost(post)}
              className="text-white bg-verde border-2 border-solid border-verde hover:text-white  hover:bg-black rounded-full p-2"
            >
              <PencilIcon className="w-[30px]" />
            </button>
            <button
              onClick={deleteCheck}
              className="text-white bg-[#ff0101] border-2 border-solid border-[#ff0101] font-bold hover:text-white hover:bg-black rounded-full p-2"
            >
              <TrashIcon className="w-[30px]" />
            </button>
          </div>
        )}
        {/* Se l'email dell'utente loggato è uguale all'email dell'autore del post, mostra i pulsanti per modificare e eliminare il post */}
        {/* INIZIO SEZIONE COMMENTI */}
        <div className=" w-full">
          {/* FORM COMMENTO */}
          <form
            className="flex flex-col items-center gap-3 p-3 text-black"
            onSubmit={handleCommentSubmit}
          >
            <textarea
              name="content"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Il tuo commento"
              className="w-full h-full"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-verde border-2 border-solid border-verde hover:text-white hover:bg-black rounded-full p-2 w-full"
            >
              Invia Commento
            </button>
          </form>
          {/* FINE FORM COMMENTO */}
          {/* SEZIONE COMMENTI */}
          <div className="flex flex-col items-center gap-3 p-3 text-black">
            <h2 className="text-4xl font-semibold font-mono text-white">
              Comments
            </h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="text-white border-2 border-solid border-verde rounded-lg p-3 w-full flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold font-mono text-verde">{comment.name}</h3>
                  <h4 className="text-lg font-mono">{comment.email}</h4>
                  <p className="text-lg font-mono">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-white text-2xl">No comments yet</p>
            )}
          </div>
          {/* FINE SEZIONE COMMENTI */}
        </div>
      </div>

      <DeleteCheck
        handleDelete={handleDelete}
        id={id}
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
      />
      {editPost && editPost._id === post._id && (
        <UpdateModalPost
          editPost={editPost}
          setEditPost={setEditPost}
          setIsEditing={setIsEditing}
          handleUpdate={handleUpdate}
        />
      )}
      {/* IMG Autore e email */}
      <Link
        to={`/author/${author._id}`}
        className="flex flex-col items-center gap-3 text-white hover:text-verde mt-10 md:mt-0 hover:drop-shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out"
      >
        <h2 className="text-2xl font-semibold font-mono">Author</h2>
        <img
          className="rounded-full w-[30%]"
          src={author.avatar}
          alt={author.nome}
        />
        <h3 className="text-[20px] font-semibold font-mono">
          {author.nome} {author.cognome}
        </h3>
      </Link>
    </div>
  );
}
