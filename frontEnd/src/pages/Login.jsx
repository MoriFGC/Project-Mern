import { useState } from "react"; // Importa il hook useState da React per gestire lo stato
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare programmaticamente
import { loginUser } from "../services/Api.js"; // Importa la funzione API per effettuare il login

export default function Login({ formData, setFormData }) {

  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina

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
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  

  return (
    <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 mt-32">
    <div className="max-w-md w-full space-y-8">
      <div className="bg-black p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-verde text-white py-2 rounded hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-white text-center mt-8">Don't have an account? <Link to="/register" className="text-verde hover:text-white">Sign up</Link></p> 
      </div>
    </div>
  </div>
  );
}