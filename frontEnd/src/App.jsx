import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import SinglePost from './pages/SinglePost'
import CreatePost from './pages/CreatePost'
import SingleAuthor from './pages/SingleAuthor'
import Register from './pages/Register'
import Login from './pages/Login'
import Page404 from './pages/Page404'
import { Flowbite } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { FlowbiteFT } from './components/FlowbiteFooter'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Controlla prima se c'è una preferenza salvata nel localStorage
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    // Se non c'è una preferenza salvata, usa la preferenza del sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Aggiungi un listener per i cambiamenti della preferenza di sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    // Rimuovi il listener quando il componente viene smontato
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Flowbite theme={{ dark: darkMode }}>
      <Router>
        <Navbar darkMode={darkMode} />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/author/:id' element={<SingleAuthor />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
        <FlowbiteFT darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </Router>
    </Flowbite>
  )
}

export default App