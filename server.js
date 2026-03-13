require('dotenv').config();
const http = require("http");
const app = require('./app');

const server = http.createServer(app);

server.listen( process.env.API_PORT || 3000, '0.0.0.0', function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});