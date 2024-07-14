import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";

export default function Post({posts, isLoading}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mx-10">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    )
  }
    
  return (
    <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mx-10">
        {
            posts.map((post) => (
            <Link className="flex flex-col :w-full h-full bg-[#000000] rounded-lg mt-5 hover:drop-shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out"
            to={`/post/${post._id}`} 
            key={post._id}>
                <div className="h-[200px] 2xl:h-[380px] overflow-hidden">
                    <img className='w-full h-full rounded-t-lg object-cover' src={post.cover} alt={post.title} />
                </div>
                <div className="text-white font-mono text-center pt-5">
                    <h2 className="text-[30px] font-bold">{post.title}</h2>
                    <p>Autore: {post.author}</p>
                </div>
            </Link>
            ))
        }
    </div>
  )
}

