import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const keysDB = {
  'ABC123': { username: 'Alice', uid: 1, expiration: new Date(2025, 11, 31) },
  'DEF456': { username: 'Bob', uid: 2, expiration: new Date(2025, 5, 30) },
  'GHI789': { username: 'Charlie', uid: 3, expiration: new Date(2024, 11, 31) },
}

app.use(express.json())

app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
      </head>
      <body>
        <h1>who.ru</h1>
        <p>crackers are NOT welcome here</p>
      </body>
    </html>
  `)
})

// -----------------------------
// Auth endpoint
// Example: /auth?key=ABC123
// -----------------------------
app.get('/auth', (req, res) => {
  const { key } = req.query

  if (!key || !keysDB[key]) {
    return res.status(401).send('Unauthorized: Invalid key')
  }

  const record = keysDB[key]
  const now = new Date()

  if (now > record.expiration) {
    return res.status(401).send('Unauthorized: Key expired')
  }

  // Key is valid, return "script"
  res.type('text').send(`print('hello from the server')`)
})

// -----------------------------
// Health check
// -----------------------------
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
