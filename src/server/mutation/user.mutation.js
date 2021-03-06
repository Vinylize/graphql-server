import bcrypt from 'bcrypt';
import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import admin from '../util/firebase/firebase';

import {
  defaultSchema,
  refs
} from '../util/firebase/firebase.database.util';

import {
  mRefs,
  mDefaultSchema
} from '../util/sequelize/sequelize.database.util';

import smsUtil from '../util/sms.util';
import {
  iamportCreateSubscribePayment,
  iamportDeleteSubscribePayment,
  iamportPayfromRegisterdUser
} from '../util/payment/iamportSubscribe.util';

const saltRounds = 10;

const createUserMutation = {
  name: 'createUser',
  description: 'Register User to firebase via yetta server.',
  inputFields: {
    e: { type: new GraphQLNonNull(GraphQLString) },
    n: { type: new GraphQLNonNull(GraphQLString) },
    pw: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ e, pw, n }) => new Promise((resolve, reject) => {
    // create user at firebase
    admin.auth().createUser({
      email: e,
      emailVerified: false,
      password: pw,
      displayName: n,
      disabled: false
    })
      .then(createdUser => refs.user.root.child(createdUser.uid).set({
        id: createdUser.uid,
        e,
        n,
        pw: bcrypt.hashSync(pw, saltRounds),
        cAt: Date.now(),
        ...defaultSchema.user.root
      })
        .then(() => refs.user.userQualification.child(createdUser.uid).set({
          ...defaultSchema.user.orderQualification
        }))
        .then(() => refs.user.runnerQualification.child(createdUser.uid).set({
          ...defaultSchema.user.runnerQualification
        }))
        // mysql
        .then(() => mRefs.user.root.createData({
          e,
          n,
          pw: bcrypt.hashSync(pw, saltRounds),
          cAt: Date.now(),
          ...mDefaultSchema.user.root
        }, createdUser.uid))
      )
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
  })
};

const userSignInMutation = {
  name: 'userSignIn',
  description: 'user sign in to yetta server.',
  inputFields: {
    dt: { type: new GraphQLNonNull(GraphQLString) },
    d: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ dt, d }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      if (dt !== undefined && dt !== 'undefined') {
        return refs.user.root.child(user.uid).update({ dt, d })
        // mysql
          .then(() => mRefs.user.root.updateData({ dt, d }, { where: { row_id: user.uid } }))
          .then(() => resolve({ result: user.d && user.d === d ? 'OK' : 'WARN : There is another device logged in. That will be logged out.' }))
          .catch(reject);
      }
      return reject('No deviceToken Error.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const userSignOutMutation = {
  name: 'userSignOut',
  description: 'user sign out from yetta server.',
  inputFields: {},
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ dt, d }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.root.child(user.uid).update({ dt: null, d: null })
        // mysql
        .then(() => mRefs.user.root.updateData({ dt: null, d: null }, { where: { row_id: user.uid } }))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userUpdateNameMutation = {
  name: 'userUpdateName',
  description: 'user update their name.',
  inputFields: {
    n: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ n }, { user }) => new Promise((resolve, reject) =>
    refs.user.root.child(user.uid).child('n').set(n)
    // mysql
    .then(() => mRefs.user.root.updateData({ n }, { where: { row_id: user.uid } }))
      .then(resolve({ result: 'OK' }))
      .catch(reject))
};

const userRequestPhoneVerifiactionMutation = {
  name: 'userRequestPhoneVerification',
  description: 'Send verification message to user.',
  inputFields: {
    p: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ p }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      const code = smsUtil.getRandomCode();
      smsUtil.sendVerificationMessage(p, code);
      // mysql
      return refs.user.phoneVerificationInfo.child(user.uid).set({
        code,
        eAt: Date.now() + (120 * 1000)
      })
        .then(() => refs.user.root.child(user.uid).child('p').set(p))
        // mysql
        .then(() => mRefs.user.root.updateData({
          p,
          code,
          eAt: Date.now() + (120 * 1000)
        }, { where: { row_id: user.uid } }))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
    }
    return reject('This mutation needs accessToken');
  })
};

const userResponsePhoneVerificationMutation = {
  name: 'userResponsePhoneVerification',
  description: 'Verification of phoneNumber.',
  inputFields: {
    code: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ code }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      // mysql
      return refs.user.phoneVerificationInfo.child(user.uid).once('value')
        .then((snap) => {
          if (snap.val().code === code && snap.val().eAt > Date.now()) {
            return Promise.resolve();
          }
          if (snap.val().eAt < Date.now()) {
            // top priority
            return reject('time exceeded.');
          }
          return reject('wrong code.');
        })
        .then(() => refs.user.root.child(user.uid).child('isPV').set(true))
        .then(() => refs.user.phoneVerificationInfo.child(user.uid).child('vAt').set(Date.now()))
        // mysql
        .then(() => mRefs.user.root.findDataById(['code', 'eAt'], user.uid)
          .then((users) => {
            if (users[0].code === code && users[0].eAt > Date.now()) {
              return Promise.resolve();
            }
            if (users[0].eAt < Date.now()) {
              return reject('time exceeded.');
            }
            throw new Error('Wrong code.');
          })
          .then(() => mRefs.user.root.updateData({ isPV: true, vAt: Date.now() }, { where: { row_id: user.uid } })))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userAgreeMutation = {
  name: 'userAgree',
  description: 'user agree agreement',
  inputFields: {
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: (_, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.userQualification.child(user.uid).update({
        isA: true,
        aAt: Date.now()
      })
      // mysql
      .then(() => mRefs.user.root.updateData({ isUA: true, uAAt: Date.now() }, { where: { row_id: user.uid } }))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userAddAddressMutation = {
  name: 'userAddAddress',
  description: 'user add address',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    mAddr: { type: new GraphQLNonNull(GraphQLString) },
    sAddr: { type: new GraphQLNonNull(GraphQLString) },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ name, mAddr, sAddr, lat, lon }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.address.child(user.uid).push().set({
        name,
        mAddr,
        sAddr,
        lat,
        lon
      })
      // mysql
      .then(() => mRefs.user.userAddress.createData({
        name,
        mAddr,
        sAddr,
        lat,
        lon
      }, user.uid))
      .then(() => resolve({ result: 'OK' }))
      .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userSetModeMutation = {
  name: 'userSetMode',
  description: 'user set runner or user.',
  inputFields: {
    mode: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ mode }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.root.child(user.uid).child('mode').set(mode)
        // mysql
        .then(() => mRefs.user.root.updateData({ mode }, { where: { row_id: user.uid } }))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userSetRunnerModeMutation = {
  name: 'userSetRunnerMode',
  description: 'user set runner mode(Active or inactive).',
  inputFields: {
    rMode: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ rMode }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return refs.user.root.child(user.uid).child('rMode').set(rMode)
        // mysql
        .then(() => mRefs.user.root.updateData({ rMode }, { where: { row_id: user.uid } }))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

// TODO : impl add multiple payment method.
const userCreateIamportSubscribePaymentMutation = {
  name: 'userCreateIamportSubscribePayment',
  description: 'user set iamport subscribe payment',
  inputFields: {
    num: { type: new GraphQLNonNull(GraphQLString) },
    exp: { type: new GraphQLNonNull(GraphQLString) },
    birth: { type: new GraphQLNonNull(GraphQLString) },
    pw2: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ num, exp, birth, pw2 }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return iamportCreateSubscribePayment(user.uid, num, exp, birth, pw2)
       .then((result) => {
         console.log(JSON.stringify(result));
         return resolve({ result });
       })
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const userDeleteIamportSubscribePaymentMutation = {
  name: 'userDeleteIamportSubscribePayment',
  description: 'user set iamport subscribe payment',
  inputFields: {
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: (_, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return iamportDeleteSubscribePayment(user.uid)
        .then((result) => {
          console.log(JSON.stringify(result));
          return resolve({ result });
        })
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const testPayfromRegisterdUserMutation = {
  name: 'testPayfromRegisterdUser',
  description: 'testPayfromRegisterdUser',
  inputFields: {
    oId: { type: new GraphQLNonNull(GraphQLString) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ oId, amount }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return iamportPayfromRegisterdUser(user.uid, oId, amount, oId)
        .then((result) => {
          console.log(JSON.stringify(result));
          return resolve({ result });
        })
        .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};


const UserMutation = {
  createUser: mutationWithClientMutationId(createUserMutation),
  userSignIn: mutationWithClientMutationId(userSignInMutation),
  userSignOut: mutationWithClientMutationId(userSignOutMutation),
  userUpdateName: mutationWithClientMutationId(userUpdateNameMutation),
  userRequestPhoneVerification: mutationWithClientMutationId(userRequestPhoneVerifiactionMutation),
  userResponsePhoneVerification: mutationWithClientMutationId(userResponsePhoneVerificationMutation),
  userAgree: mutationWithClientMutationId(userAgreeMutation),
  userAddAddress: mutationWithClientMutationId(userAddAddressMutation),
  userSetMode: mutationWithClientMutationId(userSetModeMutation),
  userSetRunnerMode: mutationWithClientMutationId(userSetRunnerModeMutation),
  userCreateIamportSubscribePayment: mutationWithClientMutationId(userCreateIamportSubscribePaymentMutation),
  userDeleteIamportSubscribePayment: mutationWithClientMutationId(userDeleteIamportSubscribePaymentMutation),
  testPayfromRegisterdUser: mutationWithClientMutationId(testPayfromRegisterdUserMutation)
};

export default UserMutation;
