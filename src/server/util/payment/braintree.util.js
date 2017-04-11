import braintree from 'braintree';

const gateway = braintree.connect({
  environment: (process.env.NODE_ENV === 'production') ? braintree.Environment.Production : braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

export default gateway;
