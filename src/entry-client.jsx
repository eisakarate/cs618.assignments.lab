import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'

const router = createBrowserRouter(routes)

//add react runtime to "root"
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
)
