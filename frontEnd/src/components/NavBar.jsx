import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logoDark from "../assets/logoDark.svg";
import logoWhite from "../assets/logoWhite.svg";
import DropdownProfile from "./DropdownProfile";

export default function Navbar({ darkMode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      setIsLoggedIn(!!token);
      setUserData(storedUserData);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-5 h-[100px] text-black dark:text-white bg-white dark:bg-black fixed top-0 w-full z-50 transition-colors duration-300 border-b border-gray-200 dark:border-white/30 ">
      <div>
        <Link to="/">
          <img className="md:w-[150px]" src={darkMode ? logoDark : logoWhite} alt="Strive logo" />
        </Link>
      </div>
      {isLoggedIn ? (
        <>
          {userData && <DropdownProfile handleLogout={handleLogout} author={userData} />}
          <div>
            <Link to="/create">
              <button className="border-2 border-solid border-transparent text-xl font-bold hover:border-verde rounded-lg p-[5px] md:p-[10px] md:px-4 font-mono transition-all duration-300 ease-in-out">
                + New Post
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex gap-4 justify-center items-center text-black dark:text-white font-mono">
          <Link className="hover:text-verde" to="/login">Login</Link>
          <Link className="hover:text-verde" to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}