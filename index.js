/**
 * SMS-REG.com API 2.0
 *
 * @author Maxim Tsyplakov <maxim.tsyplakov@gmail.com>
 *
 */

'use strict';

let http = require('http');
let qs = require('querystring');

const defaults = {
  host: 'api.sms-reg.com'
  ,port: 80
};

const model = {
  getNum: ['country', 'service', 'appid']
  ,setReady: ['tzid']
  ,getState: ['tzid']
  ,getOperations: ['opstate', 'count']
  ,setOperationOk: ['tzid']
  ,setOperationRevise: ['tzid']
  ,setOperationOver: ['tzid']
  ,getNumRepeat: ['tzid']
  ,getNumRepeatOffline: ['tzid', 'type', 'log', 'pas']
  ,setOperationUsed: ['tzid']
  ,vsimGet: ['country', 'period']
  ,vsimGetSMS: ['order_id']
  ,orderAdd: ['count', 'country', 'service', 'options', 'name', 'age', 'gander', 'city']
  ,orderGetByID: ['order_id']
  ,listOrders: ['count']
  ,setOrderAccOk: ['histid']
  ,setOrderAccRevise: ['histid']
  ,getBalance: []
  ,setRate: ['rate']
};

/** Class representing SMS-REG.com API */
class SmsReg {
  /**
   * Create a SmsReg
   * @constructor
   * @arg {string} key - service access API key
   * @arg {string} [host=api.sms-reg.com] - API host base url
   * @arg {number} [port=80] - host's port
   */
  constructor(key, host, port) {
    if (!key || typeof key !== 'string') {
      throw new Error('API key is required');
    }
    this._key = key;
    this._host = host || defaults.host;
    this._port = port || defaults.port;
  }

  /**
   * @return Balance information or Error
   */
  getNum(country, service, appid) { return this._method('getNum', country, service, appid); }
  setReady(tzid) { return this._method('setReady', tzid); }
  getState(tzid) { return this._method('getState', tzid); }
  getOperations(opstate, count) { return this._method('getOperations', opstate, count); }
  setOperationOk(tzid) { return this._method('setOperationOk', tzid); }
  setOperationRevise(tzid) { return this._method('setOperationRevise', tzid); }
  setOperationOver(tzid) { return this._method('setOperationOver', tzid); }
  getNumRepeat(tzid) { return this._method('getNumRepeat', tzid); }
  getNumRepeatOffline(tzid, type, log, pas) { return this._method('getNumRepeatOffline', tzid, type, log, pas); }
  setOperationUsed(tzid) { return this._method('setOperationUsed', tzid); }
  vsimGet(country, period) { return this._method('vsimGet', country, period); }
  vsimGetSMS(order_id) { return this._method('vsimGetSMS', order_id); }
  orderAdd(count, country, service, options, name, age, gander, city) { return this._method('orderAdd', count, country, service, options, name, age, gander, city); }
  orderGetByID(order_id) { return this._method('orderGetByID', order_id); }
  listOrders(count) { return this._method('listOrders', count); }
  setOrderAccOk(histid) { return this._method('setOrderAccOk', histid); }
  setOrderAccRevise(histid) { return this._method('setOrderAccRevise', histid); }
  getBalance() { return this._method('getBalance'); }
  setRate(rate) { return this._method('setRate', rate); }

  _makeOptions(keys) {
    let r = {};
    for (let i = 0; i < keys.length; ++i) {
      let v = arguments[i + 1];
      if (v !== void 0) {
        r[keys[i]] = v;
      }
    }
    return r;
  }

  _method(name) {
    console.log('_method', name);
    return new Promise((resolve, reject) => {
      arguments[0] = model[arguments[0]];
      let options = this._makeOptions.apply(this, arguments);
      options['apikey'] = this._key;
      console.log(options);
      let req = http.request({
        hostname: this._host,
        port: this._port,
        path: `/${name}.php?${qs.stringify(options)}`
      }, res => {
        let data = String();
        res.on('data', chunk => {data += chunk; });
        res.on('end', () => {
          try {
            let o = JSON.parse(data);
            // trick for getOptions result when no tz found
            if (o['0'] && Object.keys(o).length === 1 && typeof o === 'object') {
              o = o['0'];
            }
            if (!o.response === void 0) {
              reject(`Unexpected response ${data}`);
            }
            if (['0', 'ERROR'].includes(o.response)) {
              reject(o.error_msg);
            }
            resolve(o);
          } catch (e) {
            reject(`Can't parse '${data}' with error ${e}`);
          }
        });
      });
      req.on('error', error => { reject(error.message); });
      req.end();
    });
  }
};

module.exports = SmsReg;
