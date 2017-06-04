import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  refs
} from '../util/firebase/firebase.database.util';

import {
  mRefs
} from '../util/sequelize/sequelize.database.util';

import {
  topics,
  produceMessage
} from '../util/kafka.util';

import {
  mailType,
  sendMail
} from '../util/mail.util';

import {
  setToken,
  decodeToken,
  getAuth
} from '../util/auth/auth.jwt';

const authUserType = new GraphQLObjectType({
  name: 'authUser',
  description: 'auth user as output',
  fields: () => ({
    uid: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: user => user.uid
    },
    e: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: user => user.e
    },
    n: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: user => user.n
    },
    permission: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: user => user.permission
    },
    exp: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: user => user.exp
    }
  })
});

const adminSignInMutation = {
  name: 'adminSignIn',
  description: 'admin sign in',
  inputFields: {
    e: { type: new GraphQLNonNull(GraphQLString) },
    pw: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: { type: authUserType, resolve: payload => payload.user },
    token: { type: new GraphQLNonNull(GraphQLString), resolve: payload => payload.token }
  },
  mutateAndGetPayload: ({ e, pw }) => new Promise((resolve, reject) => getAuth(e, pw, true)
    .then(auth => resolve(auth))
    .catch(reject))
};

const adminSignOutMutation = {
  name: 'adminSignOut',
  description: 'admin sign out',
  inputFields: {
    token: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ token }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      // additional logic needed
      decodeToken(token)
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminRefreshAuthMutation = {
  name: 'adminRefreshAuth',
  description: 'admin refeshes auth',
  inputFields: {
    token: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: { type: authUserType, resolve: payload => payload.user },
    token: { type: GraphQLString, resolve: payload => payload.token }
  },
  mutateAndGetPayload: ({ token }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return decodeToken(token)
      .then(result1 => setToken({
        uid: result1.user.uid,
        e: result1.user.e,
        n: result1.user.n,
        permission: result1.user.permission
      }))
      .then(result2 => resolve({ user: result2.user, token: result2.token }))
      .catch(err => reject(err));
    }
    return reject('This mutation needs accessToken.');
  })
};

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
      // return refs.user.root.child(uid).once('value')
      // .then((snap) => {
      //   if (!snap.child('isWJ').val()) return reject('This user hasn`t applied yet.');
      //   if (!snap.child('isPV').val()) return reject('This user hasn`t verified phone yet.');
      //   if (snap.child('isRA').val()) return reject('This user has been already approved.');
      //   return refs.user.root.child(uid).update({
      //     isWJ: false,
      //     isRA: true,
      //     rAAt: Date.now()
      //   });
      // })
      return refs.user.root.child(uid).update({
        isWJ: false,
        isRA: true,
        rAAt: Date.now()
      })
      // mysql
        .then(() => mRefs.user.root.updateData({ isWJ: false, isRA: true, rAAt: Date.now() }, { where: { row_id: uid } }))
        .then(() => {
          produceMessage(topics.ADMIN_APPROVE_RUNNER, uid);
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
      // return refs.user.root.child(uid).once('value')
      // .then((snap) => {
      //   if (!snap.child('isWJ').val()) return reject('This user hasn`t applied yet.');
      //   return refs.user.root.child(uid).update({
      //     isWJ: false,
      //     isRA: false,
      //     rAAt: null
      //     // A 'Reason' of disapproving runner can be added
      //   });
      // })
      return refs.user.root.child(uid).update({
        isWJ: false,
        isRA: false,
        rAAt: null
        // A 'Reason' of disapproving runner can be added
      })
        .then(() => mRefs.user.root.updateData({ isWJ: false, isRA: false, rAAt: null }, { where: { row_id: uid } }))
        .then(() => {
          produceMessage(topics.ADMIN_DISAPPROVE_RUNNER, uid);
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
      return refs.user.root.child(uid).update({
        isWJ: false,
        isRA: false,
        rAAt: null
      })
      // mysql
      .then(() => mRefs.user.root.updateData({ isWJ: false, isRA: false, rAAt: null }, { where: { row_id: uid } }))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminBlockUserMutation = {
  name: 'adminBlockUser',
  description: 'admin block user',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ uid }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return refs.user.root.child(uid).child('isB').set(true)
      .then(() => mRefs.user.root.updateData({ isB: true }, { where: { row_id: uid } }))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const adminUnblockUserMutation = {
  name: 'adminUnblockUser',
  description: 'admin unblock user',
  inputFields: {
    uid: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ uid }, { user }) => new Promise((resolve, reject) => {
    if (user && user.permission === 'admin') {
      return refs.user.root.child(uid).child('isB').set(false)
      .then(() => mRefs.user.root.updateData({ isB: false }, { where: { row_id: uid } }))
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
  adminSignIn: mutationWithClientMutationId(adminSignInMutation),
  adminSignOut: mutationWithClientMutationId(adminSignOutMutation),
  adminRefreshAuth: mutationWithClientMutationId(adminRefreshAuthMutation),
  adminApproveRunnerFirstJudge: mutationWithClientMutationId(adminApproveRunnerFirstJudgeMutation),
  adminDisapproveRunnerFirstJudge: mutationWithClientMutationId(adminDisapproveRunnerFirstJudgeMutation),
  adminDisapproveRunner: mutationWithClientMutationId(adminDisapproveRunnerMutation),
  adminBlockUser: mutationWithClientMutationId(adminBlockUserMutation),
  adminUnblockUser: mutationWithClientMutationId(adminUnblockUserMutation),
  adminSendEmailToOneUser: mutationWithClientMutationId(adminSendEmailToOneUserMutation)
};

export default AdminMutation;
