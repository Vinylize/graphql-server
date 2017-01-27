import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import GraphQLDate from 'graphql-date';

import firebase from '../util/firebase.util';
import ConnectionType from './connection.type';
import ReportType from './report.type';

const PortQualificationType = new GraphQLObjectType({
  name: 'PortQualification',
  description: 'Type of properties of port.',
  fields: () => ({
    isAgreed: { type: GraphQLBoolean },
    agreedAt: { type: GraphQLDate }
  })
});

const ShipQualificationType = new GraphQLObjectType({
  name: 'ShipQualification',
  description: 'Type of properties of ship.',
  fields: () => ({
    isAgreed: { type: GraphQLBoolean },
    agreedAt: { type: GraphQLDate },
    isApproved: {type: GraphQLBoolean },
    approvedAt: {type: GraphQLDate }
  })
});

const CoordinateType = new GraphQLObjectType({
  name: 'CoordinateType',
  description: 'CoordinateType of user.',
  fields: () => ({
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat }
  })
});

const PaymentInfoType = new GraphQLObjectType({
  name: 'paymentInfo',
  description: 'paymentInfoType of user.',
  fields: () => ({
    cardNumber: { type: GraphQLString },
    provider: { type: GraphQLString }
  })
});

const AddressType = new GraphQLObjectType({
  name: 'address',
  description: 'addressType of user.',
  fields: () => ({
    name: { type: GraphQLBoolean },
    mainAddress: { type: GraphQLDate },
    subAddress: { type: GraphQLDate },
    lat: { type: GraphQLDate },
    lon: { type: GraphQLDate }
  })
});

const PhoneValidationInfoType = new GraphQLObjectType({
  name: 'phoneValidationInfo',
  description: 'phoneValidationInfoType of user.',
  fields: () => ({
    code: { type: GraphQLInt },
    expiredAt: { type: GraphQLDate }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'UserType of Vinyl.',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    isPhoneValid: { type: GraphQLBoolean },
    rating: { type: GraphQLInt },
    country: { type: GraphQLString },
    coordinate: {
      type: CoordinateType,
      resolve: (source) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userCoordinate.child(source.id).once('value')
            .then((snap) => {
              return resolve(snap.val());
            });
        });
      }
    },
    portQualification: {
      type: PortQualificationType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userPortQualification.child(source.id).once('value')
          .then((snap) => {
            return resolve(snap.val());
          });
        });
      }
    },
    shipQualification: {
      type: ShipQualificationType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userShipQualification.child(source.id).once('value')
            .then((snap) => {
              return resolve(snap.val());
            });
        });
      }
    },
    paymentInfo: {
      type: new GraphQLList(PaymentInfoType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userPaymentInfo.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    address: {
      type: new GraphQLList(AddressType),
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userAddress.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    phoneValidationInfo: {
      type: PhoneValidationInfoType,
      resolve: (source, args, { user }) => {
        return new Promise((resolve, reject) => {
          firebase.refs.userPhoneValidationInfo.child(source.id).once('value')
            .then((snap) => resolve(snap.val()))
            .catch(reject);
        });
      }
    },
    ship: {
      type: new GraphQLList(ConnectionType),
      resolve: (source, args, { user }) => {
      }
    },
    port: {
      type: new GraphQLList(ConnectionType),
      resolve: (source, args, { user }) => {
      }
    },
    myReport: {
      type: new GraphQLList(ReportType),
      resolve: (source, args, { user }) => {
      }
    }
  })
});

export default UserType;
