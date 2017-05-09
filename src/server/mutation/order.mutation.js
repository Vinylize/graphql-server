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
  sendOrderAllPush,
  sendOrderCatchPush
} from '../util/selectivePush.util';

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
          .then(() => {
            resolve({ result: newOrderKey });
          })
          .then(() => {
            sendOrderAllPush({ oId: user.uid, nId, id: newOrderKey, eDP, dest, curr });
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
        .then(() => {
        // TODO : impl use firebase database's user name data (now use firebase auth's name data)
          sendOrderCatchPush(order, user);
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
    oId: { type: new GraphQLNonNull(GraphQLString) },
    m: { type: new GraphQLNonNull(GraphQLInt) },
    comm: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ oId, m, comm }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      if (user.uid === oId) {
        return refs.order.evalFromUser.child(oId).set({
          m,
          comm
        })
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
      }
      return reject('This user has no authorization for this order.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const runnerEvalOrderMutation = {
  NAME: 'runnerEvalOrder',
  description: 'runner evaluate order',
  inputFields: {
    oId: { type: new GraphQLNonNull(GraphQLString) },
    m: { type: new GraphQLNonNull(GraphQLInt) },
    comm: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ oId, m, comm }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      const rId = refs.order.root.child(oId).child('rId').val();
      if (user.uid === rId) {
        return refs.order.evalFromRunner.child(oId).set({
          m,
          comm
        })
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
      }
      return reject('This user has no authorization for this order.');
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
