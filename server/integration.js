var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var mercadopago = require('mercadopago');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/process_payment', function(req, res) {
    var accessToken = 'TEST-8366708351268140-021822-c697a579520a3486f1901b5076f11849-528446352';

    var data = req.body;
    console.log("data", data)
    var token = data.token;    

    mercadopago.configurations.setAccessToken(accessToken);

    var payment_data = {
        transaction_amount: parseInt(data.amount),
        token: token,
        description: data.description,
        installments: parseInt(data.installments),
        payment_method_id: data.paymentMethodId,
        payer: {
          email: data.email
        }
      };

      console.log(payment_data);

      mercadopago.payment.save(payment_data).then(function (data){
       console.log("data", data)
        return res.send(data.body);
      }).catch(function (error){
        console.log("error", error)

        if(error && error.message == "Invalid card token"){
          var messageError = 'Cartão Inválido';
          return res.send({Error: messageError});
        }

        return res.send({Error: error});
      });    
});

app.listen(3000, function(){
    console.log('Rodando server jubilado');
});