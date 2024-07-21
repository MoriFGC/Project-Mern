import { useEffect, useState } from "react"; // Importa il hook useState da React per gestire lo stato
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare programmaticamente
import { loginUser } from "../services/Api.js"; // Importa la funzione API per effettuare il login
// Importa l'URL dell'API dalla variabile d'ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Login() {

  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina
  const location = useLocation(); // Per accedere ai parametri dell'URL corrente

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Controlla se l'utente è già loggato all'apertura della pagina
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        navigate("/");
      }
    }, [navigate]);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setFormData(storedUserData);
    }
  }, []);

  //useEffect(() => {
  //  // Questo effect viene eseguito dopo il rendering del componente
  //  // e ogni volta che location o navigate cambiano
  //
  //  // Estraiamo i parametri dall'URL
  //  const params = new URLSearchParams(location.search);
  //  // Cerchiamo un parametro 'token' nell'URL
  //  const token = params.get("token");
  //
  //  if (token) {
  //    // Se troviamo un token, lo salviamo nel localStorage
  //    localStorage.setItem("token", token);
  //    // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
  //    window.dispatchEvent(new Event("storage"));
  //    // Navighiamo alla home page
  //    navigate("/");
  //  }
  //}, [location, navigate]); // Questo effect dipende da location e navigate

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userDataParam = params.get("userData");
    if (token) {
      localStorage.setItem("token", token);
      if (userDataParam) {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        localStorage.setItem("userData", JSON.stringify(userData));
      }
      window.dispatchEvent(new Event("storage"));
      setIsLoggedIn(true);
      navigate("/");
    }
  }, [location, navigate]);

  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };



  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Salva i dati dell'utente nel localStorage
      localStorage.setItem("userData", JSON.stringify(formData));
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      // alert("Login effettuato con successo!"); // Mostra un messaggio di successo
      setIsLoggedIn(true);
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  // Funzione per gestire il login con Google
  // Funzione aggiornata per gestire il login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Funzione aggiornata per gestire il login con GitHub
  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

    // Se l'utente è già loggato, reindirizza alla home page
    if (isLoggedIn) {
      return null;
    }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="bg-transparent p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-black dark:text-white text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-verde text-white dark:text-black text-xl font-mono font-semibold py-2 rounded hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
          <button 
            onClick={handleGoogleLogin} 
            className="w-full  text-verde border border-verde text-xl font-mono font-semibold py-2 rounded hover:bg-green-700 transition duration-300">
            Login with Google
          </button>
          <button 
            onClick={handleGitHubLogin} 
            className="w-full  text-verde border border-verde text-xl font-mono font-semibold py-2 rounded hover:bg-green-700 transition duration-300">
            Login with Github
          </button>
        </form>
        <p className="text-black dark:text-white text-center mt-8">Don't have an account? <Link to="/register" className="text-verde hover:text-white underline">Sign up</Link></p> 
      </div>
    </div>
  </div>
  );
}