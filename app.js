const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mysql = require('./mysql');

const formRoute = require("./src/routes/form.route");
const questaoRoute = require("./src/routes/questao.route");

app.use(morgan('dev'));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/status', async (req, res) => {
    try {
        await mysql.checkConnection();

        return res.status(200).json({
            api: 'online',
            database: 'connected',
            message: 'API conectada ao banco com sucesso'
        });
    } catch (error) {
        return res.status(503).json({
            api: 'online',
            database: 'disconnected',
            message: 'API online, mas sem conexao com o banco',
            error: error.message
        });
    }
});

app.use("/form", formRoute);
app.use("/questoes", questaoRoute);

app.use((req, res, next) => {
    const error = new Error('Not found...');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;