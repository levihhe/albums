async function loadAlbums() {
    const res = await fetch('http://localhost:3000/api/albums')
    const albums = await res.json()
    const tbody = document.querySelector('#albumsTable tbody')
    tbody.innerHTML = ''
    albums.forEach(({ id, band, title, year, genre }) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${band}</td>
            <td>${title}</td>
            <td>${year}</td>
            <td>${genre}</td>
            <td>
                <button onclick="editAlbum(${id})">Szerkesztés</button>
                <button onclick="deleteAlbum(${id})">Törlés</button>
            </td>
        `
        tbody.appendChild(tr)
    })
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const band = document.getElementById('band').value
    const title = document.getElementById('title').value
    const year = document.getElementById('year').value
    const genre = document.getElementById('genre').value

    await fetch('http://localhost:3000/api/albums', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ band, title, year, genre })
    })
    e.target.reset()
    loadAlbums()
})

async function deleteAlbum(id) {
    await fetch(`http://localhost:3000/api/albums/${id}`, { method: 'DELETE' })
    loadAlbums()
}

async function editAlbum(id) {
    const res = await fetch(`http://localhost:3000/api/albums/${id}`)
    const album = await res.json()

    const newBand = prompt('Zenekar neve:', album.band)
    const newTitle = prompt('Album címe:', album.title)
    const newYear = prompt('Kiadás éve:', album.year)
    const newGenre = prompt('Műfaj:', album.genre)

    if (newBand && newTitle && newYear && newGenre) {
        await fetch(`http://localhost:3000/api/albums/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ band: newBand, title: newTitle, year: newYear, genre: newGenre })
        })
        loadAlbums()
    }
}

loadAlbums()