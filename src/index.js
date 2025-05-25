const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express ();

//setting app
app.set('port', 3011);
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes

app.get('/user', (req, res) => {
    res.json({
        "Nombre": "Jorge",
        "Apellido": "Gonzalez",
        "Edad": 23,
        "Sexo": "Masculino"
    });
});
//levantando el servidor
//app.listen(app.get('port'), () => {
  //  console.log(`Servidor Iniciado! ${app.get('port')}`);
//});

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

sslServer.listen(app.get('port'), () => {
    console.log(`Servidor Iniciado! ${app.get('port')}`);
});
app.post('/user', (req, res) => {
    const { Nombre, Apellido, Edad, Sexo } = req.body;
    res.json({
        "Nombre": Nombre,
        "Apellido": Apellido,
        "Edad": Edad,
        "Sexo": Sexo
    });
});