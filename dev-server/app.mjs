import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const port = process.env.ORANGE_CLINICAL_DEV_SERVER_PORT

const app = express()

// !!ARH does __baseurl work in .mjs ??
// const html = fs.readFileSync(path.join(__baseurl, '..', 'build'))

// const endOfFileRegexp = /<\/html>$/

app.use(cors({ origin: 'http://localhost:1776' }))
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`\n\n-- ${req.method} ${req.url} ----------------------------------------`)
  console.log('req.cookies')
  console.log(req.cookies)
  console.log(req.cookies.orangeWebJwt)

  next()
})

app.use((req, res, next) => {
  const cookieValue = {
    ORANGE_API_URL: process.env.ORANGE_API_URL,
    AUTH_MICROSERVICE_URL: process.env.AUTH_MICROSERVICE_URL,
    ORANGE_API_AVATAR_BASE_URL: process.env.ORANGE_API_AVATAR_BASE_URL,
    X_CLIENT_SECRET: process.env.X_CLIENT_SECRET
  }

  if (req.path === '/') {
    res.setHeader('Set-Cookie', `orangeClinicalConfig=${JSON.stringify(cookieValue)}`)
  }

  next()
})

app.use(express.static('../build')) // ??ARH path.join this??
app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:')
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening on port ${port}`)
})
