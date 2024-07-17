import { Link, useParams } from "react-router-dom";
import { getAuthorId, getPostAuthor } from "../services/Api";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import img from '../assets/user.svg'
import gif from '../assets/404.gif';

export default function SingleAuthor() {
  const [author, setAuthor] = useState([]);
  const [posts, setposts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchAuthor();
  }, [id]);

  useEffect(() => {
    if (author) {
      fetchPosts();
    }
  }, [author]);

  const fetchPosts = async () => {
    try {
      const response = await getPostAuthor(author.email);
      setposts(response.data);
      console.log(posts);
    } catch (error) {
      console.error("no post", error);
    }
  };

  const fetchAuthor = async () => {
    try {
      const response = await getAuthorId(id);
      setAuthor(response.data);
    } catch (error) {
      console.error("no utente", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mb-10 text-white">
      <div className="drop-shadow-2xl  mx-auto flex flex-col justify-center items-center gap-4 text-center text-white rounded-full my-5">
        <div className="border-2 border-verde h-[200px] w-[200px] rounded-full ms-4">
          {author.avatar ? (
            <img
              className="rounded-full"
              src={author.avatar}
              alt={author.nome}
            />
          ) : (
            <img className="rounded-full" src={img} alt={author.nome} />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold font-mono">
            {author.nome} {author.cognome}
          </h2>
          {author.dataDiNascita && 
            <p className="text-xl font-mono">
              Birth Date: {author.dataDiNascita}
            </p>}
          <p className="text-xl font-mono">Email: {author.email}</p>
        </div>
      </div>
      <h3 className="text-2xl font-mono font-semibold">Posts Of This Author</h3>
      {posts.length > 0 ? (
        <Post posts={posts} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
            <img src={gif} alt='404' className='w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] mb-8'/>
          <p className="text-xl font-mono">No posts yet</p>
          {author.email && <Link to="/create" className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black rounded-lg p-[5px] md:p-[10px] md:px-4 font-mono mt-5"><button >Create your first post</button></Link>}
        </div>
      )}
    </div>
  );
}
