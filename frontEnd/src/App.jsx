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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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