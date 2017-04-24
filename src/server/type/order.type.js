import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  refs
} from '../util/firebase.util';

import UserType from './user.type';
import NodeType from './node.type';

const RegularItemType = new GraphQLObjectType({
  name: 'regularItem',
  description: 'Registerd item in node.',
  fields: () => ({
    iId: { type: GraphQLString },
    n: { type: GraphQLString },
    p: { type: GraphQLInt },
    cnt: { type: GraphQLInt },
  })
});

const CustomItemType = new GraphQLObjectType({
  name: 'customItem',
  description: 'User customed item.',
  fields: () => ({
    manu: { type: GraphQLString },
    n: { type: GraphQLString },
    cnt: { type: GraphQLInt }
  })
});

const ItemType = new GraphQLObjectType({
  name: 'Item',
  description: 'item of order.',
  fields: () => ({
    regItem: { type: new GraphQLList(RegularItemType) },
    customItem: { type: new GraphQLList(CustomItemType) }
  })
});

const DestType = new GraphQLObjectType({
  name: 'dest',
  description: 'Destination of order.',
  fields: () => ({
    n1: { type: GraphQLString },
    n2: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
  })
});

const PaymentDetailType = new GraphQLObjectType({
  name: 'paymentDetail',
  fields: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const CalculateDetailType = new GraphQLObjectType({
  name: 'calculateDetail',
  fields: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const EvalFromRunnerType = new GraphQLObjectType({
  name: 'evalFromRunner',
  fields: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const EvalFromUserType = new GraphQLObjectType({
  name: 'evalFromUser',
  fields: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const OrderType = new GraphQLObjectType({
  name: 'Connection',
  description: 'OrderType of User.',
  fields: () => ({
    id: { type: GraphQLString },
    nId: {
      type: NodeType,
      resolve: source => new Promise((resolve, reject) => {
        refs.node.root.child(source.nId).once('value')
          .then(snap => resolve(snap.val()))
          .catch(reject);
      })
    },
    oId: {
      type: UserType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.root.child(source.oId).once('value')
          .then(snap => resolve(snap.val()))
          .catch(reject);
      })
    },
    rId: {
      type: UserType,
      resolve: source => new Promise((resolve, reject) => {
        if (!source.rId) {
          return resolve();
        }
        return refs.user.root.child(source.rId).once('value')
          .then(snap => resolve(snap.val()))
          .catch(reject);
      })
    },
    items: {
      type: ItemType,
      resolve: source => new Promise((resolve, reject) => {
        let regItem = [];
        let customItem = [];
        return refs.order.regItem.child(source.id).once('value')
          .then((snap) => {
            if (snap.val() !== null) {
              regItem = Object.keys(snap.val()).map(key => snap.val()[key]);
            }
            return refs.order.customItem.child(source.id).once('value');
          })
          .then((snap) => {
            if (snap.val() !== null) {
              customItem = Object.keys(snap.val()).map(key => snap.val()[key]);
            }
            return resolve({ regItem, customItem });
          })
          .catch(reject);
      })
    },
    dest: {
      type: DestType,
      resolve: source => new Promise((resolve, reject) =>
        refs.order.dest.child(source.id).once('value')
          .then(snap => resolve(snap.val()))
          .catch(reject))
    },
    status: {
      type: GraphQLInt,
      resolve: source => new Promise((resolve, reject) => {
        // TODO: Need more precise implematation.
        const expTime = 1000 * 60 * 5;
        if (source.cancAt) {
          // cancel from user
          return resolve(4);
        }
        if (source.cAt + expTime > Date.now() && !source.rId) {
          // waiting for runner
          return resolve(0);
        }
        if (source.cAt + expTime <= Date.now() && !source.rId) {
          // expired
          return resolve(1);
        }
        if (source.rId && !source.endAt) {
          // order ongoing
          return resolve(2);
        }
        if (source.rId && source.endAt) {
          // successfully end.
          return resolve(3);
        }
        return reject('Unknown status.');
      })
    },

    cancAt: { type: GraphQLInt },
    cancDesc: { type: GraphQLString },
    rSAt: { type: GraphQLFloat },
    dC: { type: GraphQLInt },
    rC: { type: GraphQLInt },
    rImg: { type: GraphQLString },
    eDP: { type: GraphQLInt },
    rDP: { type: GraphQLInt },
    tP: { type: GraphQLInt },
    cAt: { type: GraphQLFloat },
    paymentDetail: {
      type: PaymentDetailType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.paymentDetail.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    calculateDetail: {
      type: CalculateDetailType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.calculateDetail.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    evalFromRunner: {
      type: EvalFromRunnerType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.evalFromRunner.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    },
    evalFromUser: {
      type: EvalFromUserType,
      resolve: source => new Promise((resolve, reject) => {
        refs.user.evalFromUser.child(source.id).once('value')
            .then(snap => resolve(snap.val()))
            .catch(reject);
      })
    }
  })
});

export {
  OrderType,
  ItemType
};
