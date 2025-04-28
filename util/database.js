import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err)
            else resolve(this)
        })
    })
}

export async function initializeDatabase() {
    await dbRun(`DROP TABLE IF EXISTS albums`)
    await dbRun(`CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        band TEXT,
        title TEXT,
        year INTEGER,
        genre TEXT
    );`)

    const albums = [
        { band: "Analog Balaton", title: "Repedés", year: 2023, genre: "Alternatív Elektronika" },
        { band: "Tyler, The Creator", title: "Igor", year: 2019, genre: "Hip-Hop" },
        { band: "Joji", title: "Ballads 1", year: 2018, genre: "Lo-fi R&B" },
        { band: "Skepta", title: "Ignorance Is Bliss", year: 2019, genre: "UK Rap" },
        { band: "Mac Miller", title: "Swimming", year: 2018, genre: "Hip-Hop" }
    ]

    for (const album of albums) {
        await dbRun("INSERT INTO albums (band, title, year, genre) VALUES (?, ?, ?, ?)", [album.band, album.title, album.year, album.genre])
    }
}