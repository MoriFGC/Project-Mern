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
import Page404 from './pages/Page404'


function App() {

  return (
      <Router >
        <Navbar />
        <Routes >
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/author/:id' element={<SingleAuthor />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
        <Footer />
      </Router>
  )
}

export default App