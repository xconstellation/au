import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url' //pols deplyo

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const keysDB = {
  'b20f1885-052e-414c-94ad-54f8d16b70dd': { username: 'newguy', uid: 1, expiration: new Date(2025, 11, 31) },
  '46991f86-9027-4aed-be08-d69d090d99e9': { username: 'Bob', uid: 2, expiration: new Date(2025, 5, 30) },
  '66a02209-467d-4e00-ac43-eaf01ded6a4c': { username: 'Charlie', uid: 3, expiration: new Date(2024, 11, 31) },
}//t

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
  const key = req.query.key;

  if (typeof key !== 'string' || !keysDB[key]) {
    return res.status(401).send('Unauthorized: Invalid key');
  }

  const record = keysDB[key];
  const now = new Date();

  if (now > record.expiration) {
    return res.status(401).send('Unauthorized: Key expired');
  }

  // Key is valid, return "script"
  res.type('text').send(`print('hello from the server')`);
});


// -----------------------------
// Health check
// -----------------------------
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
