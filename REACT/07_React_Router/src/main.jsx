import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './Components/Home/Home.jsx'
import About from './Components/About/About.jsx'

import Contact from './Components/Contact/Contact.jsx'
import User from './Components/User/User.jsx'
import Github from './Components/Github/Github.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    //idhi main page
    <Route path='' element={<Layout/>}>
      {/* //now chaining */}
      {/* //its like the router page in NODE js
      //writing al the Routes in obe page */}

      <Route path='/home' element={<Home/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/contact' element={<Contact/>}></Route>

      {/* //params */}
      <Route path='/user/:id' element={<User/>}></Route>
      {/* //by loader //optimize */}
      <Route path='/github' element={<Github/>}></Route>

    </Route>
  )
)

// const router = createBrowserRouter([
//   //main page
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       {
//         path:'/',
//         element:<Home/>
//       },
//       {
//         path:'/about',
//         element: <About/>
//       },
//       {
//         path:'/contact',
//         element: <Contact/>
//       }
//     ]
//   }

// ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    to provide the
    <RouterProvider router={router} />

  </React.StrictMode>,
)
