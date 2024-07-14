import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import SinglePost from './pages/SinglePost'
import CreatePost from './pages/CreatePost'
import SingleAuthor from './pages/SingleAuthor'
import Register from './pages/Register'
import Login from './pages/Login'
import { useState, useEffect } from 'react'

function App() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setFormData(storedUserData);
    }
  }, []);

  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login formData={formData} setFormData={setFormData}/>} />
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/author/:id' element={<SingleAuthor />} />
        </Routes>
        <Footer />
    </Router>
  )
}

export default App