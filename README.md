# sms-reg
[SMS-REG.com API 2.0](https://sms-reg.com/docs/APImethods.html)

# Installation

`npm install sms-reg`

# Usage

```Javascript
'use strict'

let SmsReg = require('sms-reg');
let smsreg = new SmsReg('API_KEY');

smsreg.getNum('all', 'mailru')
  .then(num => {...})
  .catch(err => {...})

// e.t.c., You can use all of SMS-REG API 2.0 methods in this manner

```
