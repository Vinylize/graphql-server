import braintree from 'braintree';

const gateway = braintree.connect({
  environment: (process.env.NODE_ENV === 'production') ?
    braintree.Environment.Production :
    braintree.Environment.Sandbox,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
});

const issueToken = () => new Promise((resolve, reject) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) return reject(err);
    return resolve(response.clientToken);
  });
});

export {
  gateway,
  issueToken
};
