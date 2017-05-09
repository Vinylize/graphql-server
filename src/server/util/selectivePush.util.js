import { sendPush } from './firebase/firebase.messaging.util';
import { refs } from './firebase/firebase.database.util';

// temp: send order notification to all runner or user.
const sendOrderAllPush = (order) => {
  let node = null;
  let userDeviceTokenList = [];
  // search node's info
  refs.node.root.child(order.nId).once('value')
    .then((snap) => {
      node = snap.val();
      return refs.user.root.once('value');
    })
    .then((snap) => {
      const userList = snap.val();
      if (userList) {
        userDeviceTokenList = Object.keys(userList)
          .map(key => userList[`${key}`])
          .filter(el => el.dt && el.id !== order.oId)
          .map(el => el.dt);
      }
      return null;
    })
    .then(() => {
      const payload = {
        notification: {
          title: `새로운 배달 - ${order.eDP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${order.curr} `,
          body: `${node.addr} ${node.n} -> ${order.dest.n1} ${order.dest.n2 ? order.dest.n2 : ''}`,
        },
        data: {
          type: 'NEW_ORDER',
          data: order.id
        }
      };

      const options = {
        priority: 'high',
        content_available: true,
        // expire sec
        timeToLive: 60 * 15
      };
      if (userDeviceTokenList.length > 0) {
        sendPush(userDeviceTokenList.length === 1 ? userDeviceTokenList[0] : userDeviceTokenList, payload, options);
      }
    })
    .catch(console.log);
};

const sendOrderSelectivePush = () => {
  // TODO: impl this.
};

const sendOrderCatchPush = (order, user) => {
  const payload = {
    notification: {
      title: '배달 시작',
      body: `${user.name}님이 배달을 시작합니다.`,
    },
    data: {
      type: 'CATCH_ORDER',
      data: order.id
    }
  };

  const options = {
    priority: 'high',
    content_available: true,
    // expire sec
    timeToLive: 60 * 15
  };

  refs.user.root.child(order.oId).once('value')
    .then((snap) => {
      if (snap.val() && snap.val().dt) {
        sendPush(snap.val().dt, payload, options);
      }
    });
};

export {
  sendOrderAllPush,
  sendOrderSelectivePush,
  sendOrderCatchPush
};
