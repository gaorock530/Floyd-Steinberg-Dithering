const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/file', (req, res) => {

    // fs.readFile('./README.md', (err, data) => {
    //     if (err) {
    //         res.send(err);
    //     }else{
    //         res.setHeader('mime-type', 'text/html');
    //         res.send({code: 200, data});
    //     }
    // });
    res.sendFile(__dirname + '/README.md');
})

app.listen(3000, (err) => {
    if (!err) console.log("running on Port:3000");
});