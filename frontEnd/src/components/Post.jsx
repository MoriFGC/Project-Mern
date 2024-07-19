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
    <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mt-10 mb-10">
        {
            posts.map((post) => (
            <Link className="relative rounded-xl"
             to={`/post/${post._id}`}
             key={post._id}>
                <div className="min-h-[400px] overflow-hidden border-2 border-transparent hover:border-verde transition-all duration-300 rounded-xl">
                  <div className="absolute w-full h-full bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                    <img className='w-full h-full rounded-xl object-cover min-h-[450px]' src={post.cover} alt={post.title} />
                    <div className="text-white font-mono text-center absolute bottom-0 left-0 w-full py-5 ">
                       <h2 className="text-[30px] font-bold">{post.title}</h2>
                       <p>Author: {post.author}</p>
                   </div>
                </div>
            </Link>
            ))
        }
    </div>
  )
}

