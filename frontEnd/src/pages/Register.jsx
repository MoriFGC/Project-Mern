import { useState } from "react"; // Importa il hook useState da React per gestire lo stato del componente
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare tra le pagine
import { registerUser } from "../services/Api.js"; // Importa la funzione registerUser dal file api.js per effettuare la registrazione

export default function Register() {
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: "",
  });

  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    // Aggiorna il campo corrispondente nello stato con il valore attuale dell'input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // // Gestore per la sottomissione del form
  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
  //   try {
  //     await registerUser(formData); // Chiama la funzione registerUser con i dati del form
  //     //console.log(formData);
  //     alert("Registrazione avvenuta con successo!"); // Mostra un messaggio di successo
  //     navigate("/login"); // Naviga alla pagina di login dopo la registrazione
  //   } catch (error) {
  //     console.error("Errore durante la registrazione:", error); // Logga l'errore in console
  //     alert("Errore durante la registrazione. Riprova."); // Mostra un messaggio di errore
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key]) {
          if (key === 'avatar' && form[key] instanceof File) {
            formData.append(key, form[key], form[key].name);
          } else {
            formData.append(key, form[key]);
          }
          console.log(`Appending to FormData: ${key}:`, form[key]);
        }
      });
      await registerUser(formData);
      alert("Registrazione avvenuta con successo!");
      navigate('/login');
    } catch(err) {
      console.error("Errore nella registrazione", err.response?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-36">
      <div className="w-full max-w-lg p-6 bg-transparent rounded-lg shadow-md text-black dark:text-white">
        <h2 className="text-2xl font-bold font-mono text-center mb-7">Registration</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col">
              <label htmlFor="firstName">First Name</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="lastName">Last Name</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500" 
                type="text"
                id="lastName"
                name="lastName"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col ">
              <label htmlFor="email">Email</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="password">Password</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-col  gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input className="px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="avatar">Choose Profile Picture</label>
              <input className="px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-verde text-white dark:text-black px-4 py-2 rounded-md hover:bg-green-700 mt-4 w-full">Register</button>
        </form>
        <p className="text-center text-gray-500 mt-5">
          Already have an account? <Link to="/login" className="text-verde hover:text-green-700">Login</Link>
        </p>
      </div>
    </div>
  );
}