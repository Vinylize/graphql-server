import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import messagingUtil from '../util/firebase.messaging.util';

const sendPushMutation = {
  name: 'sendPushTest',
  description: 'sendPush',
  inputFields: {
    registrationToken: {type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    result: { type: GraphQLString, resolve: (payload) => payload.result }
  },
  mutateAndGetPayload: ({ registrationToken }, { user }) => {
    return new Promise((resolve, reject) => {
      // if (user) {
      return messagingUtil.sendPush(registrationToken)
          .then(() => {
            return resolve({result: 'OK'});
          })
        .catch(reject);
      // }
      // return reject('This mutation needs accessToken.');
    });
  }
};

const pushMutation = {
  sendPush: mutationWithClientMutationId(sendPushMutation)
};


export default pushMutation;