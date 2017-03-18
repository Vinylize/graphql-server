import {
  admin
} from './firebase.util';

const payload = {
  notification: {
    title: 'Notification from Yetta',
    body: 'This is Yetta server.',
    click_action: 'message'
  },
  data: {
    user: 'tempUser34142413214343',
  }
};

const options = {
  priority: 'high',
  content_available: true,
  // priority: 'normal',

  // expire sec
  timeToLive: 60 * 60 * 24
};


const sendPush = registrationToken => admin.messaging().sendToDevice(registrationToken, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
export default {
  sendPush
};

