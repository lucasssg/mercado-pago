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

    this.state = {
      doSumit: false,
    };
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
    if (!this.state.doSubmit) {
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
      this.setState({ doSubmit: true })
      form.submit();
    }
  };

  onLoad() {
    console.log("TCL: document.onload -> document", document)

    this.addEvent(document.querySelector('#pay'), 'submit', this.doPay);
    this.addEvent(document.querySelector('#cardNumber'), 'keyup', this.guessingPaymentMethod);
    this.addEvent(document.querySelector('#cardNumber'), 'change', this.guessingPaymentMethod);

    window.Mercadopago.setPublishableKey("TEST-fd28ab2f-f254-4525-8849-56e1a625fd4e");
  }

  render() {
    return (
      <div style={{}}>
        <h1 style={{textAlign:"center",marginTop:20}}>Insira os dados do Cartão de Crédito</h1>
        <form action="http://localhost:3000/process_payment" method="post" id="pay" name="pay" >
        <TextField 
          id="cardholderName"
          label="Nome do Cartão"
          lineDirection="center"
          placeholder="Nome do Cartão"
          className="md-cell md-cell--bottom"
          value="MARCIO H. MEIER"
        />
        <TextField 
          id="cardNumber"
          label="Número do Cartão"
          lineDirection="center"
          placeholder="Número do Cartão"
          className="md-cell md-cell--bottom"
          value="4235647728025682"
        />
        <TextField 
          id="cardExpirationMonth"
          label="Mês Vencimento"
          lineDirection="center"
          placeholder="Mês Vencimento"
          className="md-cell md-cell--bottom"
          value="10"
        />
        <TextField 
          id="cardExpirationYear"
          label="Ano Vencimento"
          lineDirection="center"
          placeholder="Ano Vencimento"
          className="md-cell md-cell--bottom"
          value="2023"
        />
        <TextField 
          id="securityCode"
          label="Código Segurança"
          lineDirection="center"
          placeholder="Código Segurança"
          className="md-cell md-cell--bottom"
          value="999"
        />
         <TextField 
          id="paymentMethodId"
          label="Bandeira"
          lineDirection="center"
          placeholder="MasterCard, Visa..."
          className="md-cell md-cell--bottom"
          value="visa"
        />
        <TextField 
          id="docType"
          label="Tipo Documento"
          lineDirection="center"
          placeholder="CPF"
          className="md-cell md-cell--bottom"
          value="CPF"
        />
        <TextField 
          id="docNumber"
          label="Número Documento"
          lineDirection="center"
          placeholder="Digite seu CPF ou RG"
          className="md-cell md-cell--bottom"
          value="09775195977"
        />
         <TextField 
          id="description"
          label="Descrição da Compra"
          lineDirection="center"
          placeholder="Descrição"
          className="md-cell md-cell--bottom"
          value="Julinho fdp"
        />
        <TextField 
          id="amount"
          name="amount"
          label="Valor da Compra"
          lineDirection="center"
          placeholder="Valor"
          className="md-cell md-cell--bottom"
          value="129"
        />
        <TextField 
          id="installments"
          name="installments"
          label="Qtde. Parcelas"
          lineDirection="center"
          placeholder="Parcelas"
          className="md-cell md-cell--bottom"
          value="2"
        />
         <TextField 
          id="email"
          name="email"
          label="Email"
          lineDirection="center"
          placeholder="Email"
          className="md-cell md-cell--bottom"
          value="lucas@gmail.com"
        />
        <input type="submit" value="ENVIAR" />
        </form>
        {/* <form action="http://localhost:3000/process_payment" method="post" id="pay" name="pay" >
          <fieldset>
            <ul>
              <li>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="lucas_matheus@estudante.sc.senai.br" />
              </li>
              <li>
                <label for="cardNumber">Credit card number:</label>
                <input type="text" id="cardNumber" data-checkout="cardNumber" value="4235647728025682" onselectstart="return false" />
              </li>
              <li>
                <label for="securityCode">Security code:</label>
                <input type="text" id="securityCode" data-checkout="securityCode" value="999" onselectstart="return false" />
              </li>
              <li>
                <label for="cardExpirationMonth">Expiration month:</label>
                <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth" value="10" />
              </li>
              <li>
                <label for="cardExpirationYear">Expiration year:</label>
                <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" value="2023" />
              </li>
              <li>
                <label for="cardholderName">Card holder name:</label>
                <input type="text" id="cardholderName" data-checkout="cardholderName" value="MARCIO H. MEIER" />
              </li>
              <li>
                <label for="docType">Document type:</label>
                <input id="docType" data-checkout="docType" value="CPF" readonly></input>
              </li>
              <li>
                <label for="docNumber">Document number:</label>
                <input type="text" id="docNumber" data-checkout="docNumber" value="09775195977" />
              </li>
              <li>
                <label for="installments">Installments:</label>
                <input type="number" id="installments" class="form-control" name="installments" value="2" readonly></input>
              </li>
              <li>
                <label for="amount">Amount:</label>
                <input id="amount" class="form-control" name="amount" value="129"></input>
              </li>
              <li>
                <label for="description">Descrição:</label>
                <input id="description" class="form-control" name="description" value="FILHA DA PUTA"></input>
              </li>
              <li>
                <label for="paymentMethodId">Bandeira:</label>
                <input id="paymentMethodId" class="form-control" name="paymentMethodId" value="visa"></input>
              </li>
            </ul>
            <input type="hidden" name="amount" id="amount" />
            <input type="hidden" name="description" />
            <input type="hidden" name="paymentMethodId" />
            <input type="submit" value="Pay!" />
          </fieldset>
        </form> */}
      </div>
    );
  }
}

export default Integration;