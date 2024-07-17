import { Link } from 'react-router-dom';
import gif from '../assets/404.gif';

export default function Page404() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-start pt-20 mt-40'>
      <img src={gif} alt='404' className='w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] mb-8'/>
      <div className='flex flex-col items-center justify-center gap-3'>
        <h1 className='text-white text-2xl font-bold font-mono px-5'>The page you are looking for does not exist.</h1>    
        <Link to='/' className='text-white'><button className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black rounded-lg p-[5px] md:p-[10px] md:px-4 font-mono">Go back to the home page</button></Link>
      </div>
    </div>
  )
}