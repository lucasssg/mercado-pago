doSubmit = false;

function addEvent(to, type, fn){ 
    if(document.addEventListener){
        to.addEventListener(type, fn, false);
    } else if(document.attachEvent){
        to.attachEvent('on'+type, fn);
    } else {
        to['on'+type] = fn;
    }  
}; 

function getBin() {
const cardnumber = document.getElementById("cardNumber");
return cardnumber.value.substring(0,6);
};

function guessingPaymentMethod(event) {
var bin = getBin();

if (event.type == "keyup") {
    if (bin.length >= 6) {
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethodInfo);
    }
} else {
    setTimeout(function() {
        if (bin.length >= 6) {
            window.Mercadopago.getPaymentMethod({
                "bin": bin
            }, setPaymentMethodInfo);
        }
    }, 100);
}
};

function setPaymentMethodInfo(status, response) {
if (status == 200) {
    const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

    if (paymentMethodElement) {
        paymentMethodElement.value = response[0].id;
    } else {
        const input = document.createElement('input');
        input.setAttribute('name', 'paymentMethodId');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', response[0].id);     

        form.appendChild(input);
    }

    Mercadopago.getInstallments({
        "bin": getBin(),
        "amount": parseFloat(document.querySelector('#amount').value),
    }, setInstallmentInfo);

} else {
    alert(`payment method info error: ${response}`);  
    }
};

function doPay(event){
    debugger;    
    event.preventDefault();
    if(!doSubmit){
        var $form = document.querySelector('#pay');

        console.log('form',$form)
        window.Mercadopago.createToken($form, sdkResponseHandler);

        return false;
    }
};

function sdkResponseHandler(status, response) {
    console.log("TCL: sdkResponseHandler -> response", response)
    console.log("TCL: sdkResponseHandler -> status", status)
    if (status != 200 && status != 201) {
        alert("verify filled data");
    }else{
        var form = document.querySelector('#pay');
        var card = document.createElement('input');
        card.setAttribute('name', 'token');
        card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        form.appendChild(card);
        doSubmit=true;
        //form.submit();
    }
};

function nome() {
console.log("TCL: document.onload -> document", document)
    
    addEvent(document.querySelector('#pay'), 'submit', doPay);
    addEvent(document.querySelector('#cardNumber'), 'keyup', guessingPaymentMethod);
    addEvent(document.querySelector('#cardNumber'), 'change', guessingPaymentMethod);

    /*window.Mercadopago.configure({
        sandbox : true,
        access_token: 'TEST-8366708351268140-021822-c697a579520a3486f1901b5076f11849-528446352',
        client_id: "8366708351268140",
        client_secret: "gSxXCJvRFz06Yqb6v3STgjSq6sVwl4oP"
    })*/
    
    window.Mercadopago.setPublishableKey("TEST-fd28ab2f-f254-4525-8849-56e1a625fd4e");
}