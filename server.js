require('dotenv').config();
const http = require("http");
const app = require('./app');
const mysql = require('./mysql');

const server = http.createServer(app);

server.listen( process.env.API_PORT || 3000, '0.0.0.0', function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    mysql.checkConnection()
        .then(() => {
            console.log('Banco de dados conectado com sucesso.');
        })
        .catch((error) => {
            console.error('Falha ao conectar no banco de dados:', error.message);
        });
});