const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'CineDB'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

// API 1: Obtener todas las películas (con datos del director y categoría)
app.get('/peliculas', (req, res) => {
    const sql = `
        SELECT p.Identificador, p.Titulo, p.Duracion, p.Sinopsis, 
               d.Director, c.Categoria 
        FROM Peliculas p
        LEFT JOIN Directores d ON p.IDDirector = d.IDDirector
        LEFT JOIN Categorias c ON p.IDCategoria = c.Identificador
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// API 2: Obtener detalle de una película por ID
app.get('/peliculas/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT p.*, d.Director, c.Categoria 
        FROM Peliculas p
        LEFT JOIN Directores d ON p.IDDirector = d.IDDirector
        LEFT JOIN Categorias c ON p.IDCategoria = c.Identificador
        WHERE p.Identificador = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('API corriendo en http://localhost:3000');
});