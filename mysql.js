var mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE_NAME,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT,
    "waitForConnections": true,
    "connectionLimit": 10,
    "queueLimit": 0,
    "enableKeepAlive": true,
    "keepAliveInitialDelayMs": 0
});

pool.on('error', (error) => {
    console.error('Pool error:', error);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (error.code === 'PROTOCOL_ERROR') {
        console.error('Database protocol error.');
    }
    if (error.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    }
    if (error.code === 'ER_AUTHENTICATION_PLUGIN_ERROR') {
        console.error('Database authentication plugin error.');
    }
    if (error.code === 'ER_HANDSHAKE_INCOMPAT_V10') {
        console.error('Database handshake error.');
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Database access denied.');
    }
});

const pool_multi = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE_NAME,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT,
    "multipleStatements": true,
    "waitForConnections": true,
    "connectionLimit": 10,
    "queueLimit": 0,
    "enableKeepAlive": true,
    "keepAliveInitialDelayMs": 0
});

pool_multi.on('error', (error) => {
    console.error('Multi Pool error:', error);
});

exports.execute = (query, params = [], var_pool = pool) => {
    return new Promise((resolve, reject) => {
        var_pool.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

exports.pool = pool;
exports.pool_multi = pool_multi;