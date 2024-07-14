import React from 'react'
import logo from '../assets/strive_logo_color.svg'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='px-[10%] py-8 bg-black w-full mt-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
            <div>
                <Link to='/'>
                    <img className="w-[180px]" src={logo} alt="Strive logo" />
                </Link>
            </div>
            <div>
                <ul className='text-white flex flex-col mt-5 md:mt-0 md:flex-row gap-4 items-center text-[20px] font-semibold'>
                    <li className='hover:underline hover:text-verde'><a href="#">Privacy Policy | GDPR</a></li>
                    <li className='hover:underline hover:text-verde'><a href="#">About</a></li>
                    <li className='hover:underline hover:text-verde'><a href="#">Contacts</a></li>
                </ul>
            </div>
        </div>
    </footer>
  )
}