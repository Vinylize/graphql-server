import FCM from 'fcm-push';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const FCM_TOKEN = process.env.FCM_TOKEN;

const NOTIFICATION_CONFIG = {
  sound: 'default',
  vibrate: 300
};

function generateBody(notificationType, bodyParam) {
  if (notificationType === 'MESSAGE') {
    return `${bodyParam}`;
  }
  return `${bodyParam} ${NOTIFICATION_TYPE[notificationType].bodyParam}`;
}


export default {
  sendPush(receiverId, notificationType, bodyParam, extraData = {}) {
    User.findOne({ _id: receiverId }).exec()
      .then((receiverProfile) => {
        receiverProfile.deviceToken.forEach(token => {
          const message = {
            to: token,
            notification: {
              content_available: true,
              body: generateBody(notificationType, bodyParam),
              sound: NOTIFICATION_CONFIG.sound,
              vibrate: NOTIFICATION_CONFIG.vibrate
            },
            data: {
              notificationType: notificationType,
              extraData: extraData
            },
            priority: 'high'
          };
          const fcm = new FCM(FCM_TOKEN);
          fcm.send(message)
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

