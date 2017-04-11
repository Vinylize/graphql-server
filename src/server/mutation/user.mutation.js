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

import {
  admin,
  defaultSchema,
  refs
} from '../util/firebase.util';

import {
  userGeoFire
} from '../util/firebase.geofire.util';

import smsUtil from '../util/sms.util';


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
          pw: bcrypt.hashSync(pw, saltRounds),
          n,
          cAt: Date.now(),
          ...defaultSchema.user.root
        })
            .then(() => refs.user.userQualification.child(createdUser.uid).set({
              ...defaultSchema.user.orderQualification
            }))
            .then(() => refs.user.runnerQualification.child(createdUser.uid).set({
              ...defaultSchema.user.runnerQualification
            })))
        .then(() => resolve({ result: 'OK' }))
        .catch(reject);
  })
};

const userUpdateCoordinateMutation = {
  name: 'userUpdateCoordinate',
  description: '',
  inputFields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ lat, lon }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      return userGeoFire.set(user.uid, [lat, lon])
        .then(() => {
          resolve({ result: 'OK' });
        }, (error) => {
          reject(error);
        });
    }
    return reject('This mutation needs accessToken.');
  })
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
      return refs.user.phoneVerificationInfo.child(user.uid).set({
        code,
        eAt: Date.now() + (120 * 1000)
      })
          .then(() => refs.user.root.child(user.uid).child('p').set(p))
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
      return refs.user.phoneVerificationInfo.child(user.uid).once('value')
          .then((snap) => {
            if (snap.val().eAt < Date.now()) {
              // top priority
              return reject('time exceeded.');
            } else if (snap.val().code !== code) {
              // secondary priority
              return reject('wrong code.');
            }
            return null;
          })
          .then(() => refs.user.root.child(user.uid).child('isPV').set(true))
          .then(() => refs.user.phoneVerificationInfo.child(user.uid).child('vAt').set(Date.now()))
          .then(() => resolve({ result: 'OK' }))
          .catch(reject);
    }
    return reject('This mutation needs accessToken.');
  })
};

const UserMutation = {
  createUser: mutationWithClientMutationId(createUserMutation),
  userUpdateCoordinate: mutationWithClientMutationId(userUpdateCoordinateMutation),
  userRequestPhoneVerification: mutationWithClientMutationId(userRequestPhoneVerifiactionMutation),
  userResponsePhoneVerification: mutationWithClientMutationId(userResponsePhoneVerificationMutation)
};

export default UserMutation;
