import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

import {
  refs
} from '../util/firebase.util';

import UserType from './user.type';

const ItemType = new GraphQLInputObjectType({
  name: 'Item',
  fields: () => ({
    nId: { type: GraphQLString },
    iId: { type: GraphQLString },
    cnt: { type: GraphQLInt },
    price: { type: GraphQLInt },
    curr: { type: GraphQLInt },
    pSAt: { type: GraphQLFloat },
    pFAt: { type: GraphQLFloat },
// if custom type
    iName: { type: GraphQLString },
    iPr: { type: GraphQLFloat }
  })
});

const PaymentDetailType = new GraphQLInputObjectType({
  name: 'paymentDetail',
  field: () => ({
  })
});

const CalculateDetailType = new GraphQLInputObjectType({
  name: 'calculateDetail',
  field: () => ({
  })
});

const EvalFromRunnerType = new GraphQLInputObjectType({
  name: 'evalFromRunner',
  field: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const EvalFromUserType = new GraphQLInputObjectType({
  name: 'evalFromUser',
  field: () => ({
    m: { type: GraphQLInt },
    comm: { type: GraphQLString }
  })
});

const OrderType = new GraphQLObjectType({
  name: 'Connection',
  description: 'OrderType of User.',
  fields: () => ({
    id: { type: GraphQLString },
    oId: { type: UserType },
    rId: { type: UserType },
    RSAt: { type: GraphQLFloat },
    dC: { type: GraphQLInt },
    rC: { type: GraphQLInt },
    rImg: { type: GraphQLString },
    eAt: { type: GraphQLFloat },
    items: { type: new GraphQLList(ItemType) },
    EDP: { type: GraphQLInt },
    RDP: { type: GraphQLInt },
    itemP: { type: GraphQLInt },
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
