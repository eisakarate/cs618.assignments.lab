import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Chat } from './pages/Chat.jsx'
import { Signup } from './pages/Singup.jsx'
import { Login } from './pages/login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'

//import router
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// create a query client
const queryClient = new QueryClient()

//define routes
const router = createBrowserRouter([
  {
    path: '/', //root of the application
    element: <Chat />, //got othe "blog" component
  },
  {
    path: `/signup`, //set the route
    element: <Signup />, //display the signup page
  },
  {
    path: `/login`, //set the route
    element: <Login />, //display the signup page
  },
])

export function App() {
  return (
    //wrap the authentication provider with query-engine
    //wrap the route provider with authentication provider
    //call router provider instead of the <blog/> component directly
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
