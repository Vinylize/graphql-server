import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import { sendPush } from '../util/firebase/firebase.messaging.util';

const sendPushMutation = {
  name: 'sendPushTest',
  description: 'sendPush',
  inputFields: {
    registrationToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ registrationToken }) => new Promise((resolve, reject) =>
      // if (user) {
       sendPush(registrationToken)
         .then(() => resolve({ result: 'OK' }))
         .catch(reject)
      // }
      // return reject('This mutation needs accessToken.');
    )
};

const pushMutation = {
  sendPush: mutationWithClientMutationId(sendPushMutation)
};


export default pushMutation;
