import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/strive_logo_color.svg";
import DropdownProfile from "./DropdownProfile";
import { getAuthorEmail } from "../services/Api";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [author, setAuthor] = useState([]);
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
//---------------------------------------- fecth per prendere l'autore
  useEffect(() => {
    const fetchAuthor = async () => {
      if (userData && userData.email) {
        try {
          const response = await getAuthorEmail(userData.email);
          if (response && response.data) {
            setAuthor(response.data);
          } else {
            console.error("Dati dell'autore non validi");
          }
        } catch (error) {
          console.error("Errore nella richiesta dell'autore", error);
        }
      }
    };

    fetchAuthor();
  }, [userData]);

//------------------------------------------------------------ funzione per tornare alla pagina login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    setAuthor(null);
    navigate("/login");
  };

  useEffect(() => {
    console.log(author);
  }, [author])

  console.log(userData);
  return (
    <nav className="flex justify-between items-center px-[10%] py-5 h-[100px] bg-black">
      <div>
        <Link to="/">
          <img className="md:w-[150px] text-black" src={logo} alt="Strive logo" />
        </Link>
      </div>
      {isLoggedIn ? (
        <>
          {author && <DropdownProfile handleLogout={handleLogout} author={author}/>}
          <div>
            <Link to="/create">
              <button className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black rounded-lg p-[5px] md:p-[10px] md:px-4 font-mono">
                + New Post
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex gap-4 justify-center items-center text-white font-mono">
          <Link className="hover:text-verde" to="/login">Login</Link>
          <Link className="hover:text-verde" to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}