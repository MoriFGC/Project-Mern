import { useEffect, useState, Fragment } from "react";
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

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import userImg from '../assets/user.svg'
"use client";

import { Spinner } from "flowbite-react";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null); //post
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [author, setAuthor] = useState({});
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  //console.log(userData);

  const navigate = useNavigate();
  //--------------------------------------- fetch user data -----------------------------
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
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchAuthor();
    }
  }, [post]);
  //------------------------ fetch post, commenti e autori ----------------------
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
  //-------------- delete, post e update dei commenti -----------------------
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
        avatar: userData.avatar,
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
      await updateComment(id, editingCommentId, {
        content: editCommentContent,
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === editingCommentId
            ? { ...comment, content: editCommentContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
    }
  };
  //--------------------------------------- delete e update dei post --------------------------
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
      setPost((prevPost) => ({ ...prevPost, ...editPost }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error with the update function", error);
    }
  };

  //funzione per gestire l'espansione/compressione dei commenti
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!post) return <div className="mt-52 min-h-screen flex flex-col items-center justify-center gap-5 text-2xl">
    <Spinner color="success" aria-label="Success spinner example" className="w-20 h-20"/>
    Loading...
    </div>;

  return (
    <div className="mx-auto min-h-screen flex flex-col items-start mt-40 md:grid md:grid-cols-3 text-black dark:text-white">
      <div className="hidden md:block"></div>
      {/* inizio post */}
      <div className="flex flex-col items-center relative w-full">
        <img
          className="rounded-[20px] w-full mx-auto"
          src={post.cover}
          alt={post.title}
        />
        <div className="w-full flex flex-col items-center">
          <h1 className="text-center text-3xl mt-5 mb-2 font-mono">
            {post.title}
          </h1>
          <div className="bg-white dark:bg-footer border border-solid border-black/30 dark:border-white/30 dark:text-white w-full rounded-lg">
            <p className=" font-mono p-3">{post.content}.</p>
          </div>
        </div>
        {/* fine post */}
        {/* ----------------------------- bottone per editare e delete ---------------------------- */}
        {userData?.email === post.author && (
          <Menu as="div" className="absolute right-2 top-7 ">
            <MenuButton>
              <EllipsisVerticalIcon
                className="w-8 h-8 border-2 border-transparent rounded-full hover:border-verde/50 transition duration-300 ease-in-out"
                aria-hidden="true"
              />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 w-40 mt-2 origin-top-right bg-white dark:bg-black divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-verde text-white"
                            : "text-black dark:text-white"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => setEditPost(post)}
                      >
                        Update
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-red-500 text-white"
                            : "text-black dark:text-white"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={deleteCheck}
                      >
                        Delete
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        )}
        {/* fine bottone per editare e delete */}
        <div className="w-full mt-20">
          <form
            className="flex flex-col items-center gap-1 p-3 text-black"
            onSubmit={handleCommentSubmit}
          >
            <textarea
              name="content"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Type your comment here."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-white focus:border-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            ></textarea>
            <button
              type="submit"
              className="border border-solid border-black/70 dark:border-white/70 hover:bg-verde/50 text-black dark:text-white  p-2 w-full transition duration-300 ease-in-out rounded-lg"
            >
              Send Comment
            </button>
          </form>

          <div className="flex flex-col items-center gap-3 p-3 text-black">
            <h2 className="text-4xl font-semibold font-mono text-black dark:text-white">
              Comments
            </h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="text-black dark:text-white border border-solid border-black/30 dark:border-white/30 bg-white dark:bg-footer p-3 w-full rounded-lg"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 ">
                        <img
                          src={comment.avatar || userImg}
                          alt={comment.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-xl font-bold font-mono">
                            {comment.name}
                          </h3>
                          <span className="text-sm font-mono text-black/80 dark:text-white/80">
                            {comment.email}
                          </span>
                        </div>
                      </div>
                      {/* bottone per editare e delete */}
                      {userData?.email === comment.email && (
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                              <EllipsisVerticalIcon
                                className="w-5 h-5 text-black dark:text-white"
                                aria-hidden="true"
                              />
                            </MenuButton>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <MenuItems className="absolute right-0 w-40 mt-2 origin-top-right bg-white dark:bg-black divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="px-1 py-1 ">
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? "bg-verde text-white"
                                          : "text-black dark:text-white"
                                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                      onClick={() => {
                                        setEditingCommentId(comment._id);
                                        setEditCommentContent(comment.content);
                                      }}
                                    >
                                      Update
                                    </button>
                                  )}
                                </MenuItem>
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? "bg-red-500 text-white"
                                          : "text-black dark:text-white"
                                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                      onClick={() =>
                                        handleCommentDelete(comment._id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  )}
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Transition>
                        </Menu>
                      )}
                      {/* fine bottone per editare e delete */}
                    </div>
                    {editingCommentId === comment._id ? (
                      <form onSubmit={handleCommentUpdate}>
                        <textarea
                          value={editCommentContent}
                          onChange={(e) =>
                            setEditCommentContent(e.target.value)
                          }
                          className="w-full p-2 text-black"
                        />
                        <button
                          type="submit"
                          className="bg-verde text-white p-2 mt-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentContent("");
                          }}
                          className="bg-gray-500 text-white p-2 mt-2 ml-2 rounded"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div>
                        <p
                          className={`text-lg font-mono transition-all duration-300 whitespace-pre-wrap break-words ${
                            expandedComments[comment._id]
                              ? "line-clamp-none"
                              : "line-clamp-2"
                          }`}
                        >
                          {comment.content}
                        </p>
                        {comment.content.length > 100 && (
                          <button
                            onClick={() => toggleCommentExpansion(comment._id)}
                            className="text-verde hover:underline mt-1 transition-all duration-300"
                          >
                            {expandedComments[comment._id]
                              ? "Show less"
                              : "Show more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black dark:text-white">No comments yet.</p>
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
        className="flex flex-col items-center gap-3 text-black dark:text-white mb-20 mt-10 md:mt-0 hover:drop-shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out hover:text-verde group"
      >
        <h2 className="text-2xl font-semibold font-mono group-hover:text-verde">Author</h2>
        <img
          className="rounded-full w-[30%] group-hover:text-verde"
          src={author.avatar}
          alt={author.nome}
        />
        <h3 className="text-xl font-semibold font-mono group-hover:text-verde">
          {author.nome} {author.cognome}
        </h3>
      </Link>
    </div>
  );
}
