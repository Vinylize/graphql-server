import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  refs
} from '../util/firebase/firebase.database.util';

import {
  mailType,
  sendMail
} from '../util/mail.util';

const adminApproveRunnerFirstJudgeMutation = {
  name: 'adminApproveRunnerFirstJudge',
  description: 'admin approve runner at first judge',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ uid }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return refs.user.root.child(uid).once('value')
      .then((snap) => {
        if (!snap.child('isWJ').val()) return reject('This user hasn`t applied yet.');
        if (!snap.child('isPV').val()) return reject('This user hasn`t verified phone yet.');
        if (snap.child('isRA').val()) return reject('This user has been already approved.');
        return refs.user.root.child(uid).update({
          isWJ: false,
          isRA: true,
          rAAt: Date.now()
        });
      })
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminDisapproveRunnerFirstJudgeMutation = {
  name: 'adminDisapproveRunnerFirstJudge',
  description: 'admin disapprove runner at first judge',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ uid }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return refs.user.root.child(uid).once('value')
      .then((snap) => {
        if (!snap.child('isWJ').val()) return reject('This user hasn`t applied yet.');
        if (snap.child('isRA').val() === false) return reject('This user has been already disapproved.');
        return refs.user.root.child(uid).update({
          isWJ: false,
          isRA: false,
          rAAt: null
          // A 'Reason' of disapprovingrunner can be added
        });
      })
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminDisapproveRunnerMutation = {
  name: 'adminDisapproveRunner',
  description: 'admin disapprove runner',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ uid }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return refs.user.root.child(uid).once('value')
      .then((snap) => {
        if (snap.child('isRA').val() === false) return reject('This user has been already disapproved.');
        return refs.user.root.child(uid).update({
          isWJ: false,
          isRA: false,
          rAAt: null
        });
      })
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminSendEmailToOneUserMutation = {
  name: 'adminSendEmailToOneUser',
  description: 'admin send email',
  inputFields: {
    to: { type: new GraphQLNonNull(GraphQLString) },
    subject: { type: new GraphQLNonNull(GraphQLString) },
    html: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ to, subject, html }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return sendMail(mailType.service, to, subject, html)
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const AdminMutation = {
  adminApproveRunnerFirstJudge: mutationWithClientMutationId(adminApproveRunnerFirstJudgeMutation),
  adminDisapproveRunnerFirstJudge: mutationWithClientMutationId(adminDisapproveRunnerFirstJudgeMutation),
  adminDisapproveRunner: mutationWithClientMutationId(adminDisapproveRunnerMutation),
  adminSendEmailToOneUser: mutationWithClientMutationId(adminSendEmailToOneUserMutation)
};

export default AdminMutation;
