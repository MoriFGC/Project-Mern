import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser, getUserData } from "../services/Api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    
    if (token) {
      localStorage.setItem("token", token);
      fetchUserData(token);
    }
  }, [location, navigate]);

  const fetchUserData = async (token) => {
    try {
      const userData = await getUserData();
      localStorage.setItem("userData", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      await fetchUserData(response.token);
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

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
              className="w-full text-verde border border-verde text-xl font-mono font-semibold py-2 rounded hover:bg-green-700 transition duration-300">
              Login with Google
            </button>
            <button 
              onClick={handleGitHubLogin} 
              className="w-full text-verde border border-verde text-xl font-mono font-semibold py-2 rounded hover:bg-green-700 transition duration-300">
              Login with Github
            </button>
          </form>
          <p className="text-black dark:text-white text-center mt-8">Don't have an account? <Link to="/register" className="text-verde hover:text-black dark:hover:text-white underline">Sign up</Link></p> 
        </div>
      </div>
    </div>
  );
}