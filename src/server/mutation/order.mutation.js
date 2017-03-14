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
} from '../util/firebase.util';

const ItemType = new GraphQLInputObjectType({
  name: 'Item',
  fields: () => ({
    nodeId: { type: new GraphQLNonNull(GraphQLString) },
    itemId: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
// if custom type
    itemName: { type: GraphQLString },
    itemPrice: { type: GraphQLFloat }
  })
});

const userCreateOrderMutation = {
  name: 'userCreateOrder',
  inputFields: {
    items: { type: new GraphQLNonNull(new GraphQLList(ItemType)) },
    dCategory: { type: new GraphQLNonNull(GraphQLInt) },
    rCategory: { type: new GraphQLNonNull(GraphQLInt) },
    currency: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({ items, dCategory, rCategory, currency }, { user }) => {
    return new Promise((resolve, reject) => {
      if (user) {
        // Create new order root in firebase.
        const newRef = refs.order.root.push();
        const newOrderKey = newRef.key;
        return newRef.set({
          id: newOrderKey,
          ordererId: user.uid,
            // TODO : define order's category( delivery & runner )
          dCategory,
          rCategory,
          currency,
            // TODO : impl price calculation logic.
          estimatedDeliveryPrice: 10000,
          ...defaultSchema.order.root
        })
        // Create new orderPriperties in firebase.
          .then(() => {
            return refs.order.itemInfo.child(newOrderKey).set({
              ...items
            });
          })
          .then(()=> {
            resolve({result: newOrderKey});
          })
          .catch(reject);
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const runnerCatchOrderMutation = {
  name: 'runnerCatchDeliveryOrder',
  inputFields: {
    orderId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({ orderId }, {user}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        // / TODO : Maybe transaction issue will be occurred.
        return refs.order.root.child(orderId).once('value')
          .then((orderSnap) => {
            const order = orderSnap.val();
            if (!order) {
              return reject('Connection doesn\'t exist.');
            }
            if (order.ordererId === user.uid) {
              return reject('Can\'t ship your port.');
            }
            if (order.runnerId === user.uid) {
              return reject('This ship is already designated for you.');
            }
            if (order.runnerId) {
              return reject('This ship is already designated for other user.');
            }
            return refs.order.root.child(orderId).child('runnerId').set(user.uid);
          })
          .then(() => {
            resolve({result: 'OK'});
          });
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const OrderMutation = {
  userCreateOrder: mutationWithClientMutationId(userCreateOrderMutation),
  runnerCatchOrder: mutationWithClientMutationId(runnerCatchOrderMutation)
};

export default OrderMutation;
