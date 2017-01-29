import twilio from 'twilio';
import https from 'https';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const suthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, suthToken);

const bluehouseCredential =
  'Basic ' +
  new Buffer(process.env.BLUEHOUSE_APP_ID + ':' + process.env.BLUEHOUSE_API_KEY).toString('base64');

export default {
  sendTwilioMessage(to, content) {
    twilioClient.sendTwilioMessage({
      to: to,
      from: phoneNumber,
      body: content
    });
      // .then(console.log)
      // .catch(console.log);
  },

  sendBluehouseMessage(to, content) {
    const data = {
      sender: process.env.BLUEHOUSE_SENDER,
      receivers: [to],
      content: content
    };
    const body = JSON.stringify(data);
    const bluehouseOptions = {
      host: 'api.bluehouselab.com',
      port: 443,
      path: '/smscenter/v1.0/sendsms',
      headers: {
        Authorization: bluehouseCredential,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
      },
      method: 'POST'
    };
    const req = https.request(bluehouseOptions, (res) => {
      let responseBody = '';
      res.on('data', (d) => {
        responseBody = responseBody + d;
      });
      res.on('end', (d) => {
        if (res.statusCode == 200) {
          //console.log(JSON.parse(responseBody));
        } else {
          //console.log(responseBody);
        }
      });
    });
    req.write(body);
    req.end();
    req.on('error', function (err) {
      //console.error(err);
    });
  },

  getRandomCode() {
    return Math.floor(Math.random() * 9000) + 1000;
  },

  sendVerificationMessage(to, code) {
    this.sendBluehouseMessage(to, `Vinyl verification code : ${code}`);
  }
};
