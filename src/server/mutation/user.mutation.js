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
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ email, password, name }) => new Promise((resolve, reject) => {
    admin.auth().createUser({
      email,
      emailVerified: false,
      password,
      displayName: name,
      disabled: false
    })
        .then(createdUser => refs.user.root.child(createdUser.uid).set({
          id: createdUser.uid,
          email,
          password: bcrypt.hashSync(password, saltRounds),
          name,
          createdAt: Date.now(),
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
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    result: { type: GraphQLString, resolve: payload => payload.result }
  },
  mutateAndGetPayload: ({ phoneNumber }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      const code = smsUtil.getRandomCode();
      smsUtil.sendVerificationMessage(phoneNumber, code);
      return refs.user.phoneVerificationInfo.child(user.uid).set({
        code,
        expiredAt: Date.now() + (120 * 1000)
      })
          .then(() => refs.user.root.child(user.uid).child('phoneNumber').set(phoneNumber))
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
            if (snap.val().expiredAt < Date.now()) {
              // top priority
              return reject('time exceeded.');
            } else if (snap.val().code !== code) {
              // secondary priority
              return reject('wrong code.');
            }
            return null;
          })
          .then(() => refs.user.root.child(user.uid).child('isPhoneValid').set(true))
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
