import { expect } from 'chai'; // Importar el método expect de chai
import app from '../index.js'; // Importar la aplicación del servidor
import http from 'http'; // Librería nativa para interactuar con el servidor

let server;
before((done) => {
    server = app.listen(3001, done); // Inicia el servidor, si es el mismo del index genera error
});

after((done) => {
    server.close(done); // Cierra el servidor después de las pruebas
});

describe('Test del Servidor de Animes', () => {
    it('Debe listar todos los animes', (done) => {
        http.get('http://localhost:3000/animes', (res) => {
            expect(res.statusCode).to.equal(200);

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const body = JSON.parse(data);
                expect(body).to.be.an('object');
                expect(Object.keys(body)).to.have.length.greaterThan(0);
                done();
                console.log(body);
            });
        });
    });

    it('Debe obtener un anime específico por ID', (done) => {
        http.get('http://localhost:3000/animes/1', (res) => {
            expect(res.statusCode).to.equal(200);

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const body = JSON.parse(data);
                expect(body).to.be.an('object');
                expect(body).to.have.property('nombre', 'Akira');
                done();
                console.log(body);
            });
        });
    });

    it('Debe devolver un error 404 si el anime no existe', (done) => {
        http.get('http://localhost:3000/animes/999', (res) => {
            expect(res.statusCode).to.equal(404);

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const body = JSON.parse(data);
                expect(body).to.have.property('message', 'Anime no encontrado');
                done();
                console.log(body);
            });
        });
    });
});
