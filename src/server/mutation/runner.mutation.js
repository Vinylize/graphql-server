import {
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  refs
} from '../util/firebase.util';

const runnerAgreeMutation = {
  name: 'runnerAgree',
  description: 'runner agree agreement',
  inputFields: {
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ NULL }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      const newRef = refs.user.runnerQualification.child(user.uid);
      return newRef.child('isA').set(true)
      .then(() => newRef.child('aAt').set(Date.now()))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const RunnerMutation = {
  runnerAgree: mutationWithClientMutationId(runnerAgreeMutation)
};

export default RunnerMutation;
