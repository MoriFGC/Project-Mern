import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getPost,
  getAuthorEmail,
  getComments,
  addComment,
  getMe,
  deleteComment,
  updateComment,
} from "../services/Api";
import { deletePost, updatePost } from "../services/Api";
import { DeleteCheck } from "../components/DeleteCheck";
import { UpdateModalPost } from "../components/UpdateModalPost";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [author, setAuthor] = useState({});
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUserData(userData);
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
      }
    };
    fetchUserData();
    fetchPostAndComments();
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchAuthor();
    }
  }, [post]);

  const fetchPostAndComments = async () => {
    try {
      const postResponse = await getPost(id);
      setPost(postResponse.data);
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
    } catch (err) {
      console.error("Errore nella richiesta del post o dei commenti", err);
    }
  };

  const fetchAuthor = async () => {
    try {
      const response = await getAuthorEmail(post.author);
      setAuthor(response.data);
    } catch (error) {
      console.error("Errore nella richiesta dell'autore", error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

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

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Errore nell'eliminazione del commento:", error);
      alert("Errore nell'eliminazione del commento. Riprova.");
    }
  };

  const handleCommentUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateComment(id, editingCommentId, { content: editCommentContent });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === editingCommentId
            ? { ...comment, content: editCommentContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentContent('');
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error with the delete function", error);
    }
  };

  const deleteCheck = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePost(editPost, id);
      setPost(prevPost => ({ ...prevPost, ...editPost }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error with the update function", error);
    }
  };

  if (!post) return <div>Caricamento...</div>;

  return (
    <div className="mx-auto md:mt-[50px] min-h-screen flex flex-col items-start mt-10 md:grid md:grid-cols-3 text-white">
      <div className="hidden md:block"></div>
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
        {userData?.email === post.author && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setEditPost(post)}
              className="text-white bg-verde border-2 border-solid border-verde hover:text-white hover:bg-black rounded-full p-2"
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
        <div className="w-full">
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
          <div className="flex flex-col items-center gap-3 p-3 text-black">
            <h2 className="text-4xl font-semibold font-mono text-white">
              Comments
            </h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="text-white border-2 border-solid border-verde rounded-lg p-3 w-full"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold font-mono text-verde">
                      {comment.name}
                    </h3>
                    <h4 className="text-lg font-mono">{comment.email}</h4>
                    {editingCommentId === comment._id ? (
                      <form onSubmit={handleCommentUpdate}>
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          className="w-full p-2 text-black"
                        />
                        <button
                          type="submit"
                          className="bg-verde text-white p-2 mt-2 rounded"
                        >
                          Salva
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentContent('');
                          }}
                          className="bg-gray-500 text-white p-2 mt-2 ml-2 rounded"
                        >
                          Annulla
                        </button>
                      </form>
                    ) : (
                      <p className="text-lg font-mono">{comment.content}</p>
                    )}
                  </div>
                  {(userData?.email === comment.email ||
                    userData?.email === post.author) && (
                    <div className="flex justify-between gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditCommentContent(comment.content);
                        }}
                        className="bg-verde border-2 w-full flex justify-center border-solid border-verde hover:text-white hover:bg-black rounded-full p-2"
                      >
                        <PencilIcon className="w-[30px]" />
                      </button>
                      <button
                        onClick={() => handleCommentDelete(comment._id)}
                        className="bg-[#ff0101] border-2 w-full flex justify-center border-solid border-[#ff0101] hover:text-white hover:bg-black rounded-full p-2"
                      >
                        <TrashIcon className="w-[30px]" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-white">No comments yet.</p>
            )}
          </div>
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