const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.get('/imagen/:tipo/:img', (req, res) =>{
    let tipo = req.params.tipo;
    let img  = req.params.tipo;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let pathNotFound = path.resolve(__dirname, '../assets/not-found.jpg');
    
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }else{
        res.sendFile(pathNotFound);
    }

});

module.exports = app;