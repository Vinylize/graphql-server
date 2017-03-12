import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import firebase from '../util/firebase.util';
import UserType from '../type/user.type';
import ConnectionType from '../type/order.type';

const connectionOpenPortMutation = {
  name: 'connectionOpenPort',
  inputFields: {
    category: { type: new GraphQLNonNull(GraphQLString) },
    subCategory: { type: new GraphQLNonNull(GraphQLString) }

    // / TODO : define connection initial data.
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({ category, subCategory }, { user }) => {
    return new Promise((resolve, reject) => {
      if (user) {
        const newRef = firebase.refs.connection.push();
        const newKey = newRef.key;
        return newRef.set({
          id: newKey,
          port: user.uid,
          category,
          subCategory,
          ...firebase.defaultSchema.connection
        })
          .then(()=> {
            resolve({result: 'OK'});
          })
          .catch(reject);
      } else {
        return reject('This mutation needs accessToken.');
      }
    });
  }
};

const connectionStartShipMutation = {
  name: 'connectionStartShip',
  inputFields: {
    connectionId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({ connectionId }, {user}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        // / TODO : Maybe transaction issue will be occurred.
        return firebase.refs.connection.child(connectionId).once('value')
          .then((connectionSnap) => {
            const connection = connectionSnap.val();
            if (!connection) {
              return reject('Connection doesn\'t exist.');
            }
            if (connection.port === user.uid ) {
              return reject('Can\'t ship your port.');
            }
            if (connection.ship === user.uid) {
              return reject('This ship is already designated for you.');
            }
            if (connection.ship) {
              return reject('This ship is already designated for other user.');
            }
            return firebase.refs.connection.child(connectionId).child('ship').set(user.uid);
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
  connectionOpenPort: mutationWithClientMutationId(connectionOpenPortMutation),
  connectionStartShip: mutationWithClientMutationId(connectionStartShipMutation)
};

export default OrderMutation;
