import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/Api.js";

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          if (key === 'avatar' && formData[key] instanceof File) {
            formDataToSend.append(key, formData[key], formData[key].name);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      await registerUser(formDataToSend);
      alert("Registrazione avvenuta con successo!");
      navigate("/login");
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      alert("Errore durante la registrazione. Riprova.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-36">
      <div className="w-full max-w-lg p-6 bg-transparent rounded-lg shadow-md text-black dark:text-white">
        <h2 className="text-2xl font-bold font-mono text-center mb-7">Registration</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col">
              <label htmlFor="nome">First Name</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="text"
                id="nome"
                name="nome"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="cognome">Last Name</label>
              <input className="w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500" 
                type="text"
                id="cognome"
                name="cognome"
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
              <label htmlFor="dataDiNascita">Date of Birth</label>
              <input className="px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-700 focus:outline-none focus:border-green-500"
                type="date"
                id="dataDiNascita"
                name="dataDiNascita"
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
                onChange={handleFileChange}
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