var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/process_payment', function(req, res) {
    
    console.log(req.body)

    res.json({
        Name: "Julio",
        Age: 24,
        Profile: "STUDENT"
    })
});

app.listen(3000, function(){
    console.log('Rodando server jubilado');
});