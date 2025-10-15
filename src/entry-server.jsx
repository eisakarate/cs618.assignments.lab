import ReactDOMServer from 'react-dom/server'
import { App } from './App.jsx'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { routes } from './routes.jsx'
import { createFetchRequest } from './requests.js'

const handler = createStaticHandler(routes)

export async function render(req) {
  const fetchRequest = createFetchRequest(req)
  const context = await handler.query(fetchRequest)
  const router = createStaticRouter(handler.dataRoutes, context)
  //use React DOM
  return ReactDOMServer.renderToString(
    <App>
      <StaticRouterProvider router={router} context={{ context }} />
    </App>,
  )
}
