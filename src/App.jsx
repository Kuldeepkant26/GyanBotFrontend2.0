import React from 'react'


import { Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import Nav from './Components/Nav'
import NotFound from './Components/NotFound'
import Signup from './Components/Signup'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import AllPosts from './Components/AllPosts'
import ShowPost from './Components/ShowPost'
import Profile from './Components/Profile'
function App() {
  return (
    <>
      <Nav></Nav>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/addpost' element={<AddPost></AddPost>}></Route>
        <Route path='/allposts' element={<AllPosts></AllPosts>}></Route>
        <Route path='/showpost/:pid' element={<ShowPost></ShowPost>}></Route>
        <Route path='/profile/:id' element={<Profile></Profile>}></Route>
        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
