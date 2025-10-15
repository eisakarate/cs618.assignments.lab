import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import { generateSitemap } from './generateSitemap.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

//define a production server
async function createProdServer() {
  const app = express()

  //use compression and server-static
  app.use((await import('compression')).default())
  app.use(
    (await import('serve-static')).default(
      path.resolve(__dirname, 'dist/client'),
      {
        index: false,
      },
    ),
  )
  //load a 'tempate" from the dist folder
  app.use('*', async (req, res, next) => {
    if (req.originalUrl === '/sitemap.xml') {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    }
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8',
      )

      //import the render from the entry-server
      const render = (await import('./dist/server/entry-server.js')).render
      const appHtml = await render(req)

      //replace server-outlet with render
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      next(e)
    }
  })
  return app
}

//define a server for DEV environment
async function createDevServer() {
  //instantiate express server
  const app = express()

  //call vite (react builder)
  const vite = await (
    await import('vite')
  ).createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)
  app.use('*', async (req, res, next) => {
    if (req.originalUrl === '/sitemap.xml') {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    }
    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )
      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )

      //prepare the render for the client
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const appHtml = await render(req)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      //send it
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })
  return app
}

const action = 'DEBUG'
if (action == 'Prod') {
  const app = await createProdServer()
  app.listen(3000, () => console.log('foo'))
} else {
  const app2 = await createDevServer()
  app2.listen(3000, () => console.log('foo'))
}
// //read from the Environment Variable
// if (process.env.NODE_ENV === 'production') {
//   const app = await createProdServer()
//   app.listen(process.env.PORT, () =>
//     console.log(
//       `ssr production server running on http://
//  localhost:${process.env.PORT}`,
//     ),
//   )
// } else {
//   const app = await createDevServer()
//   app.listen(process.env.PORT, () =>
//     console.log(
//       `ssr dev server running on http://localhost:${process.env.PORT}`,
//     ),
//   )
// }
