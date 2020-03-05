import React, { Component } from "react";
import { TextField, Button  } from "react-md";

class Integration extends React.Component {
  constructor(props) {
    super(props);

    this.addEvent = this.addEvent.bind(this);
    this.getBin = this.getBin.bind(this);
    this.guessingPaymentMethod = this.guessingPaymentMethod.bind(this);
    this.setPaymentMethodInfo = this.setPaymentMethodInfo.bind(this);
    this.doPay = this.doPay.bind(this);
    this.sdkResponseHandler = this.sdkResponseHandler.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.doSubmit = false;

  }

  componentDidMount(){
    this.onLoad();
  }

  addEvent(to, type, fn) {
    if (document.addEventListener) {
      to.addEventListener(type, fn, false);
    } else if (document.attachEvent) {
      to.attachEvent('on' + type, fn);
    } else {
      to['on' + type] = fn;
    }
  }

  getBin() {
    const cardnumber = document.getElementById("cardNumber");
    return cardnumber.value.substring(0, 6);
  };

  guessingPaymentMethod(event) {
    var bin = this.getBin();

    if (event.type == "keyup") {
      if (bin.length >= 6) {
        window.Mercadopago.getPaymentMethod({
          "bin": bin
        }, this.setPaymentMethodInfo);
      }
    } else {
      setTimeout(function () {
        if (bin.length >= 6) {
          window.Mercadopago.getPaymentMethod({
            "bin": bin
          }, this.setPaymentMethodInfo);
        }
      }, 100);
    }
  };

  setPaymentMethodInfo(status, response) {
    if (status == 200) {
      const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

      if (paymentMethodElement) {
        paymentMethodElement.value = response[0].id;
      } else {
        const input = document.createElement('input');
        input.setAttribute('name', 'paymentMethodId');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', response[0].id);

        // form.appendChild(input);
      }

      window.Mercadopago.getInstallments({
        "bin": this.getBin(),
        "amount": parseFloat(document.querySelector('#amount').value),
      }, this.setInstallmentInfo);

    } else {
      alert(`payment method info error: ${response}`);
    }
  };

  doPay(event) {
    event.preventDefault();
    if (!this.doSubmit) {
      var $form = document.querySelector('#pay');

      console.log('form', $form)
      window.Mercadopago.createToken($form, this.sdkResponseHandler);

      return false;
    }
  };

  sdkResponseHandler(status, response) {
    console.log("TCL: sdkResponseHandler -> response", response)
    console.log("TCL: sdkResponseHandler -> status", status)
    if (status != 200 && status != 201) {
      alert("verify filled data");
    } else {
      var form = document.querySelector('#pay');
      var card = document.createElement('input');
      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', response.id);
      form.appendChild(card);
      this.doSubmit = true;
      form.submit();
    }
  };

  onLoad() {
    console.log("TCL: document.onload -> document", document)

    this.addEvent(document.querySelector('#pay'), 'submit', this.doPay);
    this.addEvent(document.querySelector('#cardNumber'), 'keyup', this.guessingPaymentMethod);
    this.addEvent(document.querySelector('#cardNumber'), 'change', this.guessingPaymentMethod);

    window.Mercadopago.setPublishableKey("TEST-138e593a-f5ea-418a-ad78-2c45c1748e19");
  }

  render() {
    return (
      <div style={{}}>
        <h2 style={{textAlign:"center",marginTop:20}}>DADOS DO CARTÃO DE CRÉDITO</h2>
        <form style={{padding:10}} action="http://localhost:3000/process_payment" method="post" id="pay" name="pay" >
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="cardholderName"           
              id="cardholderName"
              label="Nome do Cartão"
              lineDirection="center"
              placeholder="Nome do Cartão"
              className="md-cell md-cell--6 md-cell--bottom"
              value="MARCIO H. MEIER"
            />
            <TextField
              data-checkout="cardNumber" 
              id="cardNumber"
              label="Número do Cartão"
              lineDirection="center"
              placeholder="Número do Cartão"
              className="md-cell md-cell--6 md-cell--bottom"
              value="4235647728025682"
            />
          </div>
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="cardExpirationMonth" 
              id="cardExpirationMonth"
              label="Mês Vencimento"
              lineDirection="center"
              placeholder="Mês Vencimento"
              className="md-cell md-cell--6 md-cell--bottom"
              value="10"
            />
            <TextField
              data-checkout="cardExpirationYear" 
              id="cardExpirationYear"
              label="Ano Vencimento"
              lineDirection="center"
              placeholder="Ano Vencimento"
              className="md-cell md-cell--6 md-cell--bottom"
              value="2023"
            />
          </div>
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="securityCode" 
              id="securityCode"
              label="Código Segurança"
              lineDirection="center"
              placeholder="Código Segurança"
              className="md-cell md-cell--6 md-cell--bottom"
              value="999"
            />
            <TextField
              data-checkout="paymentMethodId" 
              id="paymentMethodId"
              name="paymentMethodId"
              label="Bandeira"
              lineDirection="center"
              placeholder="MasterCard, Visa..."
              className="md-cell md-cell--6 md-cell--bottom"
              value="visa"
            />
          </div>
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="docType" 
              id="docType"
              label="Tipo Documento"
              lineDirection="center"
              placeholder="CPF"
              className="md-cell md-cell--6 md-cell--bottom"
              value="CPF"
            />
            <TextField
              data-checkout="docNumber" 
              id="docNumber"
              label="Número Documento"
              lineDirection="center"
              placeholder="Digite seu CPF ou RG"
              className="md-cell md-cell--6 md-cell--bottom"
              value="09775195977"
            />
          </div>
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="description" 
              id="description"
              name="description"
              label="Descrição da Compra"
              lineDirection="center"
              placeholder="Descrição"
              className="md-cell md-cell--6 md-cell--bottom"
              value="Jogo de Calota Renault Clio Aro 15"
            />
            <TextField
              data-checkout="amount" 
              id="amount"
              name="amount"
              label="Valor da Compra"
              lineDirection="center"
              placeholder="Valor"
              className="md-cell md-cell--6 md-cell--bottom"
              value="129"
            />
          </div>
          <div style={{display:"flex"}}>
            <TextField
              data-checkout="installments" 
              id="installments"
              name="installments"
              label="Qtde. Parcelas"
              lineDirection="center"
              placeholder="Parcelas"
              className="md-cell md-cell--6 md-cell--bottom"
              value="2"
            />
            <TextField
              data-checkout="" 
              id="email"
              name="email"
              label="Email"
              lineDirection="center"
              placeholder="Email"
              className="md-cell md-cell--6 md-cell--bottom"
              value="lucas@gmail.com"
            />
          </div>
          <div style={{marginTop:"5%", display:'flex', justifyContent:"center"}}>
            <input style={{cursor:"pointer", padding:5, fontSize:20, backgroundColor:"green", borderRadius:10, color:"white"}} type="submit" value="CONFIRMAR COMPRA" />
          </div>
        </form>
      </div>
    );
  }
}

export default Integration;
