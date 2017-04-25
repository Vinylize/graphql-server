import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

import NodeType from '../type/node.type';
import { OrderType } from '../type/order.type';

import category from '../../shared/category/category';

import {
  refs
} from '../util/firebase/firebase.database.util';

import {
  nodeGeoFire
} from '../util/firebase/firebase.geofire.util';

import {
  issueToken
} from '../util/payment/braintree.util';

const UserQualificationType = new GraphQLObjectType({
  name: 'userQualification',
  description: 'Type of properties of port.',
  fields: () => ({
    isA: { type: GraphQLBoolean },
    aAt: { type: GraphQLInt }
  })
});

const RunnerQualificationType = new GraphQLObjectType({
  name: 'runnerQualification',
  description: 'Type of properties of ship.',
  fields: () => ({
    isA: { type: GraphQLBoolean },
    aAt: { type: GraphQLInt },
    isWJ: { type: GraphQLBoolean },
    isFA: { type: GraphQLBoolean },
    fAAt: { type: GraphQLInt },
    isSA: { type: GraphQLBoolean },
    sAAt: { type: GraphQLInt }
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
    type: { type: GraphQLInt },
    num: { type: GraphQLString },
    provider: { type: GraphQLString }
  })
});

const RunnerPaymentInfoType = new GraphQLObjectType({
  name: 'runnerPaymentInfo',
  description: 'RunnerPaymentInfoType of user.',
  fields: () => ({
    type: { type: GraphQLInt },
    num: { type: GraphQLString },
    provider: { type: GraphQLString }
  })
});

const AddressType = new GraphQLObjectType({
  name: 'address',
  description: 'addressType of user.',
  fields: () => ({
    name: { type: GraphQLBoolean },
    mAddr: { type: GraphQLInt },
    sAddr: { type: GraphQLInt },
    lat: { type: GraphQLInt },
    lon: { type: GraphQLInt }
  })
});

const PhoneVerificationInfoType = new GraphQLObjectType({
  name: 'phoneVerificationInfo',
  description: 'phoneVerificationInfoType of user.',
  fields: () => ({
    code: { type: GraphQLInt },
    eAt: { type: GraphQLInt },
    vAt: { type: GraphQLInt }
  })
});

const HelpType = new GraphQLObjectType({
  name: 'help',
  description: 'helpType of user.',
  fields: () => ({
    comm: { type: GraphQLString },
    cAt: { type: GraphQLInt },
    ans: { type: GraphQLString },
    ansAt: { type: GraphQLInt }
  })
});

// How to use resolve.
// resolve: () => (source, { user })

const UserType = new GraphQLObjectType({
  name: 'user',
  description: 'UserType of Vinyl.',
  fields: () => ({
    id: { type: GraphQLString },
    e: { type: GraphQLString },
    n: { type: GraphQLString },
    cAt: { type: GraphQLFloat },
    p: { type: GraphQLString },
    isPV: { type: GraphQLBoolean },
    r: { type: GraphQLFloat },
    pUrl: { type: GraphQLString },
    idUrl: { type: GraphQLString },
    coordinate: {
      type: CoordinateType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.coordinate.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    userQualification: {
      type: UserQualificationType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.userQualification.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    runnerQualification: {
      type: RunnerQualificationType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.runnerQualification.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    userPaymentInfo: {
      type: new GraphQLList(UserPaymentInfoType),
      resolve: source => new Promise((resolve, reject) => {
        refs.user.userPaymentInfo.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    runnerPaymentInfo: {
      type: new GraphQLList(RunnerPaymentInfoType),
      resolve: source => new Promise((resolve, reject) => {
        refs.user.runnerPaymentInfo.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    address: {
      type: new GraphQLList(AddressType),
      resolve: source => new Promise((resolve, reject) => {
        refs.user.address.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    orderHistory: {
      type: new GraphQLList(OrderType),
      resolve: source => new Promise((resolve, reject) => {
        refs.order.root.orderByChild('oId').equalTo(source.id).once('value')
          .then(snap => resolve(
            Object.keys(snap.val())
            .map(key => snap.val()[key])
            .sort((a, b) => b.cAt - a.cAt))
          )
          .catch(reject);
      })
    },
    runnerHistory: {
      type: new GraphQLList(OrderType),
      resolve: source => new Promise((resolve, reject) => {
        refs.order.orderByChild('rId').equalTo(source.id).once('value')
          .then(snap => resolve(snap.val()))
          .catch(reject);
      })
    },
    phoneVerificationInfo: {
      type: PhoneVerificationInfoType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.phoneVerificationInfo.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    help: {
      type: new GraphQLList(HelpType),
      resolve: source => new Promise((resolve, reject) => {
        refs.user.help.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    orderStatusCategory: {
      type: GraphQLString,
      resolve: () => new Promise((resolve) => {
        resolve(JSON.stringify(category.orderStatus));
      })
    },
    nodeCategory: {
      type: GraphQLString,
      resolve: () => new Promise((resolve) => {
        resolve(JSON.stringify(category.node));
      })
    },
    node: {
      type: new GraphQLList(NodeType),
      args: {
        lat: { type: new GraphQLNonNull(GraphQLFloat) },
        lon: { type: new GraphQLNonNull(GraphQLFloat) },
        radius: { type: new GraphQLNonNull(GraphQLFloat) },
        c1: { type: new GraphQLNonNull(GraphQLInt) },
        c2: { type: GraphQLInt }
      },
      resolve: (source, { lat, lon, radius, c1, c2 }) => new Promise((resolve) => {
        const geoQuery = nodeGeoFire.query({
          center: [lat, lon],
          radius
        });
        const p = [];
        geoQuery.on('key_entered', (key, location, d) => {
          p.push(new Promise(nResolve => refs.node.root.child(key)
              .once('value')
              .then(snap => nResolve({ ...snap.val(),
                distance: d * 1.2,
                formattedDistance: Math.ceil(d * 1.2 * 10) < 10 ?
                `${Math.ceil(d * 1.2 * 10) * 100}m` : `${(d * 1.2).toFixed(1)}km`
              }))));
        });

        geoQuery.on('ready', () => {
          Promise.all(p).then((result) => {
            if (c1 === 0) {
              return resolve(result.sort((a, b) => a.distance - b.distance));
            }
            const c1Result = result.filter(node => node.c1 === c1).sort((a, b) => a.distance - b.distance);
            if (!c2 || c2 === 0) {
              return resolve(c1Result);
            }
            return resolve(c1Result.filter(node => node.c2 === c2).sort((a, b) => a.distance - b.distance));
          });
          geoQuery.cancel();
        });
      })
    },
    braintreeToken: {
      type: GraphQLString,
      resolve: () => new Promise((resolve) => {
        resolve(issueToken());
      })
    }
  })
});

export default UserType;
