import React from 'react'
import { Link } from 'react-router-dom'
import logoDark from '../assets/logoDark.svg'


export default function Footer() {
  return (
    <footer className='px-10 py-8 w-full h-40 mt-auto flex flex-col justify-center bg-black '>
        <div className='flex flex-col md:flex-row justify-between items-center w-full'>
            <div>
                <Link to='/'>
                    <img className="md:w-[150px]" src={logoDark} alt="Strive logo" />
                </Link>
            </div>
            <div>
                <ul className='text-white flex flex-col mt-5 md:mt-0 md:flex-row gap-4 items-center text-[20px] font-semibold'>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">Privacy Policy | GDPR</a></li>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">About</a></li>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">Contacts</a></li>
                </ul>
            </div>
        </div>
        <div className='border-t border-white/30 w-full my-8'></div>
        <div className='flex flex-col items-center'>
            <p className='text-white text-sm'>© 2024 Strive. All rights reserved.</p>
        </div>
    </footer>
  )
}