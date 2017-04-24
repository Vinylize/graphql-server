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
      return newRef.set({
        isA: true,
        aAt: Date.now()
      })
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const runnerApplyFirstJudgeMutation = {
  name: 'runnerApplyFirstJudge',
  description: 'runner apply at first judgement',
  inputFields: {
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ NULL }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.root.child(user.uid).child('idURL').once('value')
      .then((snap) => {
        if (snap.val()) return resolve();
        return reject('Upload identification image first.');
      })
      .then(() => refs.user.root.child(user.uid).child('isWJ').set(true))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const RunnerMutation = {
  runnerAgree: mutationWithClientMutationId(runnerAgreeMutation),
  runnerApplyFirstJudge: mutationWithClientMutationId(runnerApplyFirstJudgeMutation)
};

export default RunnerMutation;
