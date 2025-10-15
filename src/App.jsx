import { AuthContextProvider } from './contexts/AuthContext.jsx'

//import router
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PropTypes from 'prop-types'

import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient()
//define routes

export function App({ children }) {
  //childre is passed to the application - coming from the server
  return (
    //wrap the authentication provider with query-engine
    //wrap the route provider with authentication provider
    //call router provider instead of the <blog/> component directly
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
App.propTypes = {
  children: PropTypes.element.isRequired,
}
