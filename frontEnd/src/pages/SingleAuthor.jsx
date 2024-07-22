import { Link, useParams } from "react-router-dom";
import { getAuthorId, getPostAuthor } from "../services/Api";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import img from '../assets/user.svg'
import gif from '../assets/404.gif';
"use client";

import { Spinner } from "flowbite-react";

export default function SingleAuthor() {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authorResponse = await getAuthorId(id);
        setAuthor(authorResponse.data);
        
        if (authorResponse.data && authorResponse.data.email) {
          const postsResponse = await getPostAuthor(authorResponse.data.email);
          setPosts(postsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="mt-52 min-h-screen flex flex-col items-center justify-center gap-5 text-2xl">
    <Spinner color="success" aria-label="Success spinner example" className="w-20 h-20"/>
    Loading...
    </div>;
  if (!author) {
    return <div className="text-center mt-52 min-h-screen">Author not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen mb-10 text-black dark:text-white max-w-7xl mx-auto mt-40">
      <div className="drop-shadow-2xl  mx-auto flex flex-col justify-center items-center gap-4 text-center text-black dark:text-white rounded-full my-5">
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
          {author.email && <Link to="/create" className="border-2 border-solid border-transparent text-xl font-bold text-white bg-black/30 hover:dark:bg-white/30 hover:bg-verde/30 hover:border-verde rounded-xl p-[5px] md:p-[10px] md:px-4 font-mono mt-5 transition-all duration-300 ease-in-out"><button>+ Create your first post</button></Link>}
        </div>
      )}
    </div>
  );
}