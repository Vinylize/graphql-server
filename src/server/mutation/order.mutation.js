import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  ItemType
} from '../type/order.type';

import {
  defaultSchema,
  refs
} from '../util/firebase.util';

const userCreateOrderMutation = {
  name: 'userCreateOrder',
  inputFields: {
    items: { type: new GraphQLNonNull(new GraphQLList(ItemType)) },
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
  mutateAndGetPayload: ({ items, dC, rC, curr }, { user }) => new Promise((resolve, reject) => {
    if (user) {
        // Create new order root in firebase.
      const newRef = refs.order.root.push();
      const newOrderKey = newRef.key;
      return newRef.set({
        id: newOrderKey,
        oId: user.uid,
            // TODO : define order's category( delivery & runner )
        dC,
        rC,
        curr,
            // TODO : impl price calculation logic.
        EDP: 10000,
        eAt: Date.now() + (300 * 1000),
        ...defaultSchema.order.root,
      })
        // Create new orderPriperties in firebase.
          .then(() => refs.order.itemInfo.child(newOrderKey).set({
            ...items
          }))
          .then(() => {
            resolve({ result: newOrderKey });
          })
          .catch(reject);
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
      return refs.order.root.child(orderId).once('value')
          .then((orderSnap) => {
            const order = orderSnap.val();
            if (!order) {
              return reject('Order doesn\'t exist.');
            }
            if (order.oId === user.uid) {
              return reject('Can\'t ship your port.');
            }
            if (order.rId === user.uid) {
              return reject('This ship is already designated for you.');
            }
            if (order.rId) {
              return reject('This ship is already designated for other user.');
            }
            return refs.order.root.child(orderId).child('runnerId').set(user.uid);
          })
          .then(() => {
            resolve({ result: 'OK' });
          });
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
      const newRef = refs.order.evalFromUser.child(oId);
      return newRef.child('m').set(m)
      .then(() => newRef.child('comm').set(comm))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
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
      const newRef = refs.order.evalFromRunner.child(oId);
      return newRef.child('m').set(m)
      .then(() => newRef.child('comm').set(comm))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
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
