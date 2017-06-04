import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLFloat
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  defaultSchema,
  refs
} from '../util/firebase/firebase.database.util';

import {
  mRefs,
  mDefaultSchema
} from '../util/sequelize/sequelize.database.util';

import {
  sendOrderAllPush,
  sendOrderCatchPush
} from '../util/selectivePush.util';

import {
  topics,
  produceMessage
} from '../util/kafka.util';

import calcPrice from '../util/order.util';

const RegularItemType = new GraphQLInputObjectType({
  name: 'regularItemInput',
  description: 'Registerd item in node.',
  fields: () => ({
    iId: { type: new GraphQLNonNull(GraphQLString) },
    n: { type: new GraphQLNonNull(GraphQLString) },
    p: { type: new GraphQLNonNull(GraphQLInt) },
    cnt: { type: new GraphQLNonNull(GraphQLInt) },
  })
});

const CustomItemType = new GraphQLInputObjectType({
  name: 'customItemInput',
  description: 'User customed item.',
  fields: () => ({
    manu: { type: GraphQLString },
    n: { type: new GraphQLNonNull(GraphQLString) },
    cnt: { type: new GraphQLNonNull(GraphQLInt) }
  })
});

const DestType = new GraphQLInputObjectType({
  name: 'destInput',
  description: 'Destination of order.',
  fields: () => ({
    n1: { type: new GraphQLNonNull(GraphQLString) },
    n2: { type: GraphQLString },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
  })
});

const userCreateOrderMutation = {
  name: 'userCreateOrder',
  inputFields: {
    nId: { type: new GraphQLNonNull(GraphQLString) },
    regItems: { type: new GraphQLList(RegularItemType) },
    customItems: { type: new GraphQLList(CustomItemType) },
    dest: { type: new GraphQLNonNull(DestType) },
    dC: { type: new GraphQLNonNull(GraphQLInt) },
    rC: { type: new GraphQLNonNull(GraphQLInt) },
    curr: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ nId, regItems, customItems, dC, dest, rC, curr }, { user }) => new Promise((resolve, reject) => {
    if (user) {
        // Create new order root in firebase.
      if (regItems.length === 0 && customItems.length === 0) {
        // if there is no item.
        return reject('There is no items selected.');
      }
      const newRef = refs.order.root.push();
      const newOrderKey = newRef.key;
      // TODO : impl total product price.
      // TODO : impl delivery price calculation logic.
      let tP;
      let eDP;
      // check node is existing.
      return refs.node.root.child(nId).once('value')
        .then((snap) => {
          if (!snap.val()) {
            return reject('Cannot find node.');
          }
          return calcPrice(nId, regItems, [dest.lat, dest.lon]);
        })
        .then((priceArr) => {
          tP = priceArr[1];
          eDP = priceArr[0];
          return null;
        })
        .then(() => {
          newRef.set({
            id: newOrderKey,
            oId: user.uid,
            nId,
            dC,
            rC,
            curr,
            tP,
            eDP,
            cAt: Date.now(),
            ...defaultSchema.order.root,
          })
          // Create new orderPriperties in firebase.
          .then(() => refs.order.dest.child(newOrderKey).set({
            ...dest
          }))
          .then(() => refs.order.regItem.child(newOrderKey).set({
            ...regItems
          }))
          .then(() => refs.order.customItem.child(newOrderKey).set({
            ...customItems
          }))
          .then(() => mRefs.order.root.createData({
            oId: user.uid,
            nId,
            dC,
            rC,
            curr,
            tP,
            eDP,
            cAt: Date.now(),
            ...dest,
            ...mDefaultSchema.order.root,
          }, newOrderKey))
          .then(() => {
            if (regItems) return Promise.all(regItems.map(regItem => mRefs.order.regItems.createData(regItem, newOrderKey)));
            return Promise.resolve();
          })
          .then(() => {
            if (customItems) return Promise.all(customItems.map(customItem => mRefs.order.customItems.createData(customItem, newOrderKey)));
            return Promise.resolve();
          })
          .then(() => {
            resolve({ result: newOrderKey });
          })
          .then(() => {
            produceMessage(topics.ORDER_CREATE, newOrderKey);
          })
          .catch(reject);
        });
    }
    return reject('This mutation needs accessToken.');
  })
};

const runnerCatchOrderMutation = {
  name: 'runnerCatchDeliveryOrder',
  inputFields: {
    orderId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ orderId }, { user }) => new Promise((resolve, reject) => {
    if (user) {
        // / TODO : Maybe transaction issue will be occurred.
      let order;
      return refs.order.root.child(orderId).once('value')
        .then((orderSnap) => {
          order = orderSnap.val();
          if (!order) {
            throw new Error('Order doesn\'t exist.');
          }
          if (order.oId === user.uid) {
            throw new Error('Can\'t ship your port.');
          }
          if (order.rId === user.uid) {
            throw new Error('This ship is already designated for you.');
          }
          if (order.rId) {
            throw new Error('This ship is already designated for other user.');
          }
          return refs.order.root.child(orderId).child('rId').set(user.uid);
        })
        .then(() => mRefs.order.root.findDataById(['oId', 'rId'], orderId)
          .then((orders) => {
            if (orders[0].oId === user.uid) {
              throw new Error('Can\'t ship your port.');
            }
            if (orders[0].rId === user.uid) {
              throw new Error('This ship is already designated for you.');
            }
            if (orders[0].rId) {
              throw new Error('This ship is already designated for other user.');
            }
            return mRefs.order.root.updateData({ rId: user.uid }, { where: { row_id: orderId } });
          })
          .catch(() => reject('Order doesn\'t exist.'))
        )
        .then(() => {
        // TODO : impl use firebase database's user name data (now use firebase auth's name data)
          produceMessage(topics.ORDER_CATCH, orderId);
          resolve({ result: 'OK' });
        })
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userEvalOrderMutation = {
  name: 'userEvalOrder',
  description: 'user evaluate order',
  inputFields: {
    orderId: { type: new GraphQLNonNull(GraphQLString) },
    m: { type: new GraphQLNonNull(GraphQLInt) },
    comm: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ orderId, m, comm }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.order.root.child(orderId).child('oId').once('value')
      .then((snap) => {
        const oId = snap.val();
        if (user.uid === oId) {
          return refs.order.evalFromUser.child(orderId).set({
            m,
            comm
          })
          .then(() => mRefs.order.root.updateData({
            uM: m,
            uComm: comm
          }, { where: { row_id: orderId } }))
          .then(() => resolve({ result: 'OK' }))
          .catch(reject);
        }
        return reject('This user has no authorization for this order.');
      });
    }
    return reject('This mutation needs accessToken.');
  })
};

const runnerEvalOrderMutation = {
  NAME: 'runnerEvalOrder',
  description: 'runner evaluate order',
  inputFields: {
    orderId: { type: new GraphQLNonNull(GraphQLString) },
    m: { type: new GraphQLNonNull(GraphQLInt) },
    comm: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ orderId, m, comm }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.order.root.child(orderId).child('rId').once('value')
      .then((snap) => {
        const rId = snap.val();
        if (user.uid === rId) {
          return refs.order.evalFromRunner.child(orderId).set({
            m,
            comm
          })
          .then(() => mRefs.order.root.updateData({
            rM: m,
            rComm: comm
          }, { where: { row_id: orderId } }))
          .then(() => resolve({ result: 'OK' }))
          .catch(reject);
        }
        return reject('This user has no authorization for this order.');
      });
    }
    return reject('This mutation needs accessToken.');
  })
};

const OrderMutation = {
  userCreateOrder: mutationWithClientMutationId(userCreateOrderMutation),
  runnerCatchOrder: mutationWithClientMutationId(runnerCatchOrderMutation),
  userEvalOrder: mutationWithClientMutationId(userEvalOrderMutation),
  runnerEvalOrder: mutationWithClientMutationId(runnerEvalOrderMutation)
};

export default OrderMutation;
