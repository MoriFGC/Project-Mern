
"use client";

import { Footer } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import logoDark from '../assets/logoDark.svg'
import logoWhite from '../assets/logoWhite.svg'
import { Link } from "react-router-dom";
import { DarkThemeToggle } from 'flowbite-react'


export function FlowbiteFT({ darkMode, toggleDarkMode }) {
  return (
    <Footer container className="dark:bg-black transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto w-full ">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <DarkThemeToggle onClick={toggleDarkMode} className='text-black dark:text-white mt-5 lg:mt-0 hover:border-verde border-2 border-solid border-transparent hover:bg-transparent transition-all duration-300 ease-in-out lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 '/>
          <div>
            <Link to="/">
              <Footer.Brand
                className="md:w-[150px]" src={darkMode ? logoDark : logoWhite} alt="Strive logo"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Strive School™" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
