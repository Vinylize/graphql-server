import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import firebase from '../util/firebase.util';
import smsUtil from '../util/sms.util';

const createUserMutation = {
  name: 'createUser',
  description: 'Register',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({email, password, name}) => {
    return new Promise((resolve, reject) => {
      firebase.admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: name,
        disabled: false
      })
        .then((createdUser) => {
          return firebase.refs.user.child(createdUser.uid).set({
            ...firebase.defaultSchema.user
          })
            .then(() => {
              return firebase.refs.userPortQualification.child(createdUser.uid).set({
                ...firebase.defaultSchema.userPortQualification
              });
            })
            .then(() => {
              return firebase.refs.userShipQualification.child(createdUser.uid).set({
                ...firebase.defaultSchema.userShipQualification
              });
            });
        })
        .then(() => resolve({result: 'OK'}))
        .catch(reject);
    });
  }
};

const userUpdateCoordinateMutation = {
  name: 'userUpdateCoordinate',
  description: '',
  inputFields: {
    lat: {type: new GraphQLNonNull(GraphQLFloat)},
    lon: {type: new GraphQLNonNull(GraphQLFloat)}
  },
  outputFields: {
    result: { type: GraphQLString, resolve: (payload) => payload.result }
  },
  mutateAndGetPayload: (args, { user }) => {
    return new Promise((resolve, reject) => {
      if (user) {
        return firebase.refs.userCoordinate.child(user.uid).set(args)
          .then(() => resolve({result: 'OK'}))
          .catch(reject);
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const userRequestPhoneValidationMutation = {
  name: 'userRequestPhoneValidation',
  description: 'Send verification message to user.',
  inputFields: {
    phoneNumber: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    result: { type: GraphQLString, resolve: (payload) => payload.result }
  },
  mutateAndGetPayload: ({ phoneNumber }, { user }) => {
    return new Promise((resolve, reject) => {
      if (user) {
        const code = smsUtil.getRandomCode();
        console.log(code);
        smsUtil.sendVerificationMessage(phoneNumber, code);
        return firebase.refs.userPhoneValidationInfo.child(user.uid).set({
          code,
          ...firebase.defaultSchema.userPhoneValidationInfo
        })
          .then(() => resolve({result: 'OK'}))
          .catch(reject);
      }
      return reject('This mutation needs accessToken');
    });
  }
};

const userResponsePhoneValidationMutation = {
  name: 'userResponsePhoneValidation',
  description: 'Check validation of phoneNumber.',
  inputFields: {
    code: {type: new GraphQLNonNull(GraphQLInt)}
  },
  outputFields: {
    result: { type: GraphQLString, resolve: (payload) => payload.result }
  },
  mutateAndGetPayload: ({ code }, { user }) => {
    return new Promise((resolve, reject) => {
      if (user) {
        return firebase.refs.userPhoneValidationInfo.child(user.uid).once('value')
          .then((snap) => {
          console.log(snap.val(), Date.now());
            if (snap.val().expiredAt < Date.now()) {
              // top priority
              return reject('time exceeded.');
            } else if (snap.val().code !== code) {
              // secondary priority
              return reject('wrong code.');
            }
            return null;
          })
          .then(() => firebase.refs.user.child(user.uid).child('isPhoneValid').set(true))
          .then(() => resolve({ result: 'OK'}))
          .catch(reject);
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const UserMutation = {
  createUser: mutationWithClientMutationId(createUserMutation),
  userUpdateCoordinate: mutationWithClientMutationId(userUpdateCoordinateMutation),
  userRequestPhoneValidation: mutationWithClientMutationId(userRequestPhoneValidationMutation),
  userResponsePhoneValidation: mutationWithClientMutationId(userResponsePhoneValidationMutation)
};

export default UserMutation;
