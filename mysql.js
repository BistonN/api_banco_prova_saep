var mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createConnection({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE_NAME,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});

const pool_multi = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE_NAME,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT,
    "multipleStatements": true
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