import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeDatabase, dbAll, dbRun } from './util/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Listázás
app.get('/api/albums', async (req, res) => {
    const albums = await dbAll('SELECT * FROM albums ORDER BY year DESC')
    res.json(albums)
})

// Egy album megjelenítése ID alapján
app.get('/api/albums/:id', async (req, res) => {
    const { id } = req.params
    const album = await dbAll('SELECT * FROM albums WHERE id = ?', [id])
    if (album.length === 0) {
        res.status(404).json({ message: 'Album nem található.' })
    } else {
        res.json(album[0])
    }
})

// Új album hozzáadása
app.post('/api/albums', async (req, res) => {
    const { band, title, year, genre } = req.body
    await dbRun('INSERT INTO albums (band, title, year, genre) VALUES (?, ?, ?, ?)', [band, title, year, genre])
    res.status(201).json({ message: 'Album hozzáadva.' })
})

// Album módosítása
app.put('/api/albums/:id', async (req, res) => {
    const { id } = req.params
    const { band, title, year, genre } = req.body
    await dbRun('UPDATE albums SET band = ?, title = ?, year = ?, genre = ? WHERE id = ?', [band, title, year, genre, id])
    res.json({ message: 'Album módosítva.' })
})

// Album törlése
app.delete('/api/albums/:id', async (req, res) => {
    const { id } = req.params
    await dbRun('DELETE FROM albums WHERE id = ?', [id])
    res.json({ message: 'Album törölve.' })
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: `Hiba: ${err.message}` })
})

async function startServer() {
    await initializeDatabase()
    app.listen(3000, () => {
        console.log('Szerver fut: http://localhost:3000')
    })
}

startServer()