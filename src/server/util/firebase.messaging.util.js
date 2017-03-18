import {
  admin
} from './firebase.util';

const payload = {
  notification: {
    title: 'Notification from Yetta',
    body: 'This is Yetta server.',
    click_action: "message"
  },
  data: {
    user: "tempUser34142413214343",
  }
};

var options = {
  priority: 'high',
  content_available: true,
  // priority: 'normal',

  // expire sec
  timeToLive: 60 * 60 * 24
};


const sendPush = (registrationToken) => {
  return admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function (response) {
      console.log('Successfully sent message:', response);
    })
    .catch(function (error) {
      console.log('Error sending message:', error);
    });
};
export default {
  sendPush
};

