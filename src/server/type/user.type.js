import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import GraphQLDate from 'graphql-date';

import {
  refs
} from '../util/firebase.util';
import OrderType from './order.type';

const UserQualificationType = new GraphQLObjectType({
  name: 'userQualification',
  description: 'Type of properties of port.',
  fields: () => ({
    isAgreed: { type: GraphQLBoolean },
    agreedAt: { type: GraphQLInt }
  })
});

const RunnerQualificationType = new GraphQLObjectType({
  name: 'runnerQualification',
  description: 'Type of properties of ship.',
  fields: () => ({
    isAgreed: { type: GraphQLBoolean },
    agreedAt: { type: GraphQLInt },
    isFirstApproved: { type: GraphQLBoolean },
    firstApprovedAt: { type: GraphQLInt },
    isSecondApproved: { type: GraphQLBoolean },
    secondApprovedAt: { type: GraphQLInt }
  })
});

const CoordinateType = new GraphQLObjectType({
  name: 'coordinate',
  description: 'CoordinateType of user.',
  fields: () => ({
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat }
  })
});

const UserPaymentInfoType = new GraphQLObjectType({
  name: 'userPaymentInfo',
  description: 'UserPaymentInfoType of user.',
  fields: () => ({
    type: { type: GraphQLInt},
    number: { type: GraphQLString },
    provider: { type: GraphQLString }
  })
});

const RunnerPaymentInfoType = new GraphQLObjectType({
  name: 'runnerPaymentInfo',
  description: 'RunnerPaymentInfoType of user.',
  fields: () => ({
    type: { type: GraphQLInt},
    number: { type: GraphQLString },
    provider: { type: GraphQLString }
  })
});

const AddressType = new GraphQLObjectType({
  name: 'address',
  description: 'addressType of user.',
  fields: () => ({
    name: { type: GraphQLBoolean },
    mainAddress: { type: GraphQLInt },
    subAddress: { type: GraphQLInt },
    lat: { type: GraphQLInt },
    lon: { type: GraphQLInt }
  })
});

const PhoneVerificationInfoType = new GraphQLObjectType({
  name: 'phoneVerificationInfo',
  description: 'phoneVerificationInfoType of user.',
  fields: () => ({
    code: { type: GraphQLInt },
    expiredAt: { type: GraphQLInt }
  })
});

const HelpType = new GraphQLObjectType({
  name: 'help',
  description: 'helpType of user.',
  fields: () => ({
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    answer: { type: GraphQLString },
    answerdAt: { type: GraphQLInt }
  })
});

const UserType = new GraphQLObjectType({
  name: 'user',
  description: 'UserType of Vinyl.',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    phoneNumber: { type: GraphQLString },
    isPhoneValid: { type: GraphQLBoolean },
    rating: { type: GraphQLFloat },
    profileImageUrl: { type: GraphQLString },
    identificationImageUrl: { type: GraphQLString },
    coordinate: {
      type: CoordinateType,
      resolve: (source) => {
        return new Promise((resolve, reject) => {
          refs.user.coordinate.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    userQualification: {
      type: UserQualificationType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.userQualification.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    RunnerQualification: {
      type: RunnerQualificationType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.runnerQualification.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    UserPaymentInfo: {
      type: new GraphQLList(UserPaymentInfoType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.userPaymentInfo.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    RunnerPaymentInfo: {
      type: new GraphQLList(RunnerPaymentInfoType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.runnerPaymentInfo.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    address: {
      type: new GraphQLList(AddressType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.address.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    phoneVerificationInfo: {
      type: PhoneVerificationInfoType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.phoneVerificationInfo.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    help: {
      type: new GraphQLList(HelpType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          refs.user.help.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    ship: {
      type: new GraphQLList(OrderType),
      resolve: (source, args, { user }) => {
      }
    },
    port: {
      type: new GraphQLList(OrderType),
      resolve: (source, args, { user }) => {
      }
    },
  })
});

export default UserType;
