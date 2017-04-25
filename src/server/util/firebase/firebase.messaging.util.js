import admin from './firebase';

const sendPush = (deviceToken, payload, options) => admin.messaging().sendToDevice(deviceToken, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

const sendPushMany = (deviceTokenArr, payload, options) => admin.messaging().sendToDevice(deviceTokenArr, payload, options)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

export {
  sendPush,
  sendPushMany
};
