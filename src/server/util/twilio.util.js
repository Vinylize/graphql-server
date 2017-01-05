import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const suthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, suthToken);

export default {
  sendMessage(to, body) {
    twilioClient.messages.create({
      to: to,
      from: phoneNumber,
      body: body,
    });
  },

  sendVerificationMessage(to, code) {
    this.sendMessage(to, `Vinyl verification code : ${code}`);
  },
};
