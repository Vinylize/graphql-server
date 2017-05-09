import Iamport from 'iamport';

const iamport = new Iamport({
  impKey: process.env.IMP_API_KEY,
  impSecret: process.env.IMP_API_SECRET
});
/* eslint-disable */
const iamportCreateSubscribePayment = (customer_uid, card_number, expiry, birth, pwd_2digit) => new Promise((resolve, reject) => {
  iamport.subscribe_customer.create({ customer_uid, card_number, expiry, birth, pwd_2digit })
    .then(resolve)
    .catch(reject);
});

const iamportDeleteSubscribePayment = customer_uid => new Promise((resolve, reject) => {
  iamport.subscribe_customer.delete({ customer_uid })
    .then(resolve)
    .catch(reject);
});

const iamportPayfromRegisterdUser = (customer_uid, merchant_uid, amount, name) => new Promise((resolve, reject) => {
  iamport.subscribe.again({ customer_uid, merchant_uid, amount, name })
    .then(resolve)
    .catch(reject);
});
/* eslint-enable */

export {
  iamportCreateSubscribePayment,
  iamportDeleteSubscribePayment,
  iamportPayfromRegisterdUser

};
