import React from 'react'
import { Link } from 'react-router-dom'
import logoDark from '../assets/logoDark.svg'
import logoWhite from '../assets/logoWhite.svg'
import { DarkThemeToggle } from 'flowbite-react'

export default function Footer({ darkMode, toggleDarkMode }) {
  return (
    <footer className='px-10 py-8 w-full h-96 mt-auto flex flex-col justify-center bg-white dark:bg-black border-t border-gray-200 dark:border-white/30 transition-colors duration-300 relative'>
        <div className='flex flex-col md:flex-row justify-between items-center w-full'>
            <div>
                <Link to='/'>
                    <img className="md:w-[150px]" src={darkMode ? logoDark : logoWhite} alt="Strive logo" />
                </Link>
            </div>
            <DarkThemeToggle onClick={toggleDarkMode} className='text-black dark:text-white mt-5 lg:mt-0 hover:border-verde border-2 border-solid border-transparent hover:bg-transparent transition-all duration-300 ease-in-out lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 '/>
            <div className='flex items-center gap-4'>
                <ul className='text-black dark:text-white flex flex-col mt-5 md:mt-0 md:flex-row gap-4 items-center text-[20px] font-semibold'>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">Privacy Policy | GDPR</a></li>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">About</a></li>
                    <li className='hover:underline transition-all duration-300 ease-in-out'><a href="#">Contacts</a></li>
                </ul>
                
            </div>
        </div>
        <div className='border-t border-gray-200 dark:border-white/30 w-full my-8'></div>
        <div className='flex flex-col items-center mb-3'>
            <p className='text-black dark:text-white text-sm'>© 2024 Strive. All rights reserved.</p>
        </div>
    </footer>
  )
}