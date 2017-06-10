import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  mRefs
} from '../util/sequelize/sequelize.database.util';

import CoordinateType from '../type/coordinate.type';

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

// const PaymentDetailType = new GraphQLObjectType({
//   name: 'paymentDetail',
//   fields: () => ({
//     m: { type: GraphQLInt },
//     comm: { type: GraphQLString }
//   })
// });

// const CalculateDetailType = new GraphQLObjectType({
//   name: 'calculateDetail',
//   fields: () => ({
//     m: { type: GraphQLInt },
//     comm: { type: GraphQLString }
//   })
// });

const OrderType = new GraphQLObjectType({
  name: 'Connection',
  description: 'OrderType of User.',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: source => source.row_id
    },
    nId: {
      type: NodeType,
      resolve: source => new Promise((resolve, reject) =>
        mRefs.node.root.findDataById([], source.nId)
          .then(results => resolve(results[0]))
          .catch(reject))
    },
    oId: {
      type: UserType,
      resolve: source => new Promise((resolve, reject) =>
        mRefs.user.root.findDataById([], source.oId)
          .then(results => resolve(results[0]))
          .catch(reject))
    },
    rId: {
      type: UserType,
      resolve: source => new Promise((resolve, reject) => {
        if (!source.rId) {
          return resolve();
        }
        // return refs.user.root.child(source.rId).once('value')
        //   .then(snap => resolve(snap.val()))
        //   .catch(reject);
        return mRefs.user.root.findDataById([], source.rId)
          .then(results => resolve(results[0]))
          .catch(reject);
      })
    },
    items: {
      type: ItemType,
      resolve: source => new Promise((resolve, reject) => {
        let regItem = [];
        let customItem = [];
        return mRefs.order.regItems.findDataById([], source.row_id)
          .then((results) => {
            if (results.length > 0) {
              regItem = Object.keys(results[0]).map(key => results[0][key]);
            }
            return mRefs.order.customItems.findDataById([], source.row_id);
          })
          .then((results) => {
            if (results.length > 0) {
              customItem = Object.keys(results[0]).map(key => results[0][key]);
            }
            return resolve({ regItem, customItem });
          })
          .catch(reject);
      })
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

    cancAt: { type: GraphQLFloat },
    cancDesc: { type: GraphQLString },
    rSAt: { type: GraphQLFloat },
    dC: { type: GraphQLInt },
    rC: { type: GraphQLInt },
    rImg: { type: GraphQLString },
    eDP: { type: GraphQLInt },
    rDP: { type: GraphQLInt },
    tP: { type: GraphQLInt },
    cAt: { type: GraphQLFloat },
    n1: { type: GraphQLString },
    n2: { type: GraphQLString },
    coordinate: { type: CoordinateType },
    rM: { type: GraphQLInt },
    rComm: { type: GraphQLString },
    u: { type: GraphQLInt },
    uComm: { type: GraphQLString },
    // paymentDetail: {
    //   type: PaymentDetailType,
    //   resolve: source => new Promise((resolve, reject) => {
    //     refs.user.paymentDetail.child(source.row_id).once('value')
    //         .then(snap => resolve(snap.val()))
    //         .catch(reject);
    //   })
    // },
    // calculateDetail: {
    //   type: CalculateDetailType,
    //   resolve: source => new Promise((resolve, reject) => {
    //     refs.user.calculateDetail.child(source.row_id).once('value')
    //         .then(snap => resolve(snap.val()))
    //         .catch(reject);
    //   })
    // },
  })
});

export {
  OrderType,
  ItemType
};
