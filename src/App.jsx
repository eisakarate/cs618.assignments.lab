import { AuthContextProvider } from './contexts/AuthContext.jsx'

//import router
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PropTypes from 'prop-types'

import { HelmetProvider } from 'react-helmet-async'

//import apollo client
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'

const queryClient = new QueryClient()

//startup apollo client and point to the GraphQL endpoint
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

//define routes

export function App({ children }) {
  //childre is passed to the application - coming from the server
  return (
    //wrap the authentication provider with query-engine
    //wrap the route provider with authentication provider
    //call router provider instead of the <blog/> component directly

    //apollo client is added to allow the entire app to run apollo client (apollo provide)
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}
App.propTypes = {
  children: PropTypes.element.isRequired,
}
