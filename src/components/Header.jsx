import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

//setup a header link
export function Header() {
  const [token, setToken] = useAuth() //get the token, if its there

  //set the title so that it no longer reads vite+react
  //document.title = 'Corgi Blog Time!'

  //if there is a token, then display the logout, then clearout the token
  if (token) {
    const { sub } = jwtDecode(token) //get the user-id, then nullify the token, then stay on the page
    return (
      <div>
        <h1>Welcome to Corgi Blog</h1>
        <h2>By Potato Dog (a.k.a, pawsome corgi)</h2>
        Logged in as <User id={sub} />
        &nbsp;|&nbsp;
        <button onClick={() => setToken(null)}>Logout</button>
        <hr />
      </div>
    )
  }

  //display the default when there is no token
  return (
    <div>
      <h1>Welcome to Corgi Blog!</h1>
      <h2>By Potato Dog (a.k.a, pawsome corgi)</h2>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
      <hr />
    </div>
  )
}
