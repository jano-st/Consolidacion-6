import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
//const fs = require('fs');
//const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
// Ruta del archivo JSON
const DATA_PATH = './anime.json';


const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const writeData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// Mostrar todos los animes
app.get('/animes', (req, res) => {
    const data = readData();
    res.json(data);
});

// Mostrar un anime específico por ID o nombre
app.get('/animes/:idOrName', (req, res) => {
    const { idOrName } = req.params;
    const data = readData();
   let result;
     result = Object.values(data).find(
        anime => anime.nombre.toLowerCase() === idOrName.toLowerCase() 
    );
    if(!result) {
    result = data[idOrName];
    }
   
    result ? res.json(result) : res.status(404).send({ message: 'Anime no encontrado' });
});

// Crear un anime nuevo
app.post('/animes', (req, res) => {
    const newAnime = req.body;
    const data = readData();
    const newId = String(Object.keys(data).length + 1);
    data[newId] = {...newAnime };
    writeData(data);
    res.status(201).send({ message: 'Anime creado', anime: data[newId] });
});

// Actualizar un anime 
app.put('/animes/:id', (req, res) => {
    const { id } = req.params;
    const updatedAnime = req.body;
    const data = readData();
    if (data[id]) {
        data[id] = {...updatedAnime };
        writeData(data);
        res.send({ message: 'Anime actualizado', anime: data[id] });
    } else {
        res.status(404).send({ message: 'Anime no encontrado' });
    }
});

// Eliminar un anime
app.delete('/animes/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    if (data[id]) {
        delete data[id];
        writeData(data);
        res.send({ message: 'Anime eliminado' });
    } else {
        res.status(404).send({ message: 'Anime no encontrado' });
    }
});

export default app;
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

