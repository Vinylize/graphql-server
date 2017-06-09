import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

import category from '../../shared/category/category';

import CoordinateType from '../type/coordinate.type';
import NodeType from '../type/node.type';
import { OrderType } from '../type/order.type';

import {
  mRefs
} from '../util/sequelize/sequelize.database.util';

import {
  issueToken
} from '../util/payment/braintree.util';

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

const userAddressType = new GraphQLObjectType({
  name: 'userAddress',
  description: 'addressType of user.',
  fields: () => ({
    name: { type: GraphQLBoolean },
    mAddr: { type: GraphQLInt },
    sAddr: { type: GraphQLInt },
    lat: { type: GraphQLInt },
    lon: { type: GraphQLInt }
  })
});

const HelpType = new GraphQLObjectType({
  name: 'help',
  description: 'helpType of user.',
  fields: () => ({
    comm: { type: GraphQLString },
    cAt: { type: GraphQLFloat },
    ans: { type: GraphQLString },
    ansAt: { type: GraphQLFloat }
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
    mode: { type: GraphQLInt },
    idUrl: { type: GraphQLString },
    pUrl: { type: GraphQLString },
    p: { type: GraphQLString },
    isPV: { type: GraphQLBoolean },
    cAt: { type: GraphQLFloat },
    r: { type: GraphQLFloat },
    isWJ: { type: GraphQLBoolean },
    isRA: { type: GraphQLBoolean },
    rAAt: { type: GraphQLFloat },
    isB: { type: GraphQLBoolean },
    permission: { type: GraphQLString },
    isUA: { type: GraphQLBoolean },
    uAAt: { type: GraphQLFloat },
    isSA: { type: GraphQLBoolean },
    sAAt: { type: GraphQLFloat },
    code: { type: GraphQLString },
    vAt: { type: GraphQLFloat },
    eAt: { type: GraphQLFloat },
    coordinate: {
      type: CoordinateType,
      resolve: source => new Promise((resolve) => {
        if (source.coordinate) {
          return resolve({
            lat: source.coordinate.coordinates[1],
            lon: source.coordinate.coordinates[0]
          });
        }
        return resolve();
      })
    },
    userPaymentInfo: {
      type: new GraphQLList(UserPaymentInfoType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.user.userPaymentInfo.child(source.id).once('value')
        //     .then(snap => resolve(snap.val()))
        //     .catch(reject);
        mRefs.user.userPaymentInfo.findDataById([], source.id, 'row_id')
          .then(results => resolve(results))
          .catch(reject);
      })
    },
    runnerPaymentInfo: {
      type: new GraphQLList(RunnerPaymentInfoType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.user.runnerPaymentInfo.child(source.id).once('value')
        //     .then(snap => resolve(snap.val()))
        //     .catch(reject);
        mRefs.user.runnerPaymentInfo.findDataById([], source.id, 'row_id')
          .then(results => resolve(results))
          .catch(reject);
      })
    },
    userAddress: {
      type: new GraphQLList(userAddressType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.user.address.child(source.id).once('value')
        //     .then(snap => resolve(snap.val()))
        //     .catch(reject);
        mRefs.user.userAddress.findDataById([], source.id, 'row_id')
          .then(results => resolve(results))
          .catch(reject);
      })
    },
    order: {
      type: OrderType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (source, { id }) => new Promise((resolve, reject) => {
        // refs.order.root.child(id).once('value')
        //   .then((snap) => {
        //     if (snap.val()) {
        //       return resolve(snap.val());
        //     }
        //     return reject(`there is no order id ${id}`);
        //   })
        //   .catch(reject);
        mRefs.order.root.findDataById([], id)
          .then((results) => {
            if (results.length > 0) {
              return resolve(results[0]);
            }
            return reject(`there is no order id ${id}`);
          })
          .catch(reject);
      })
    },
    orderHistory: {
      type: new GraphQLList(OrderType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.order.root.orderByChild('oId').equalTo(source.id).once('value')
        //   .then(snap => resolve(
        //     Object.keys(snap.val())
        //     .map(key => snap.val()[key])
        //     .sort((a, b) => b.cAt - a.cAt))
        //   )
        //   .catch(reject);
        mRefs.order.root.findData([], { where: { oId: source.id } })
          .then(results => resolve(results.sort((a, b) => b.cAt - a.cAt)))
          .catch(reject);
      })
    },
    runnerHistory: {
      type: new GraphQLList(OrderType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.order.root.orderByChild('rId').equalTo(source.id).once('value')
        //   .then(snap => resolve(snap.val()))
        //   .catch(reject);
        mRefs.order.root.findData([], { where: { rId: source.id } })
          .then(results => resolve(results))
          .catch(reject);
      })
    },
    help: {
      type: new GraphQLList(HelpType),
      resolve: source => new Promise((resolve, reject) => {
        // refs.user.help.child(source.id).once('value')
        //     .then(snap => resolve(snap.val()))
        //     .catch(reject);
        mRefs.user.help.findDataById([], source.id, 'row_id')
          .then(results => resolve(results))
          .catch(reject);
      })
    },
    nearbyRunner: {
      type: new GraphQLList(CoordinateType),
      args: {
        centerLat: { type: new GraphQLNonNull(GraphQLFloat) },
        centerLon: { type: new GraphQLNonNull(GraphQLFloat) },
        radius: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (source, { centerLat, centerLon, radius }) => new Promise((resolve) => {
        mRefs.user.root.findDataInsideRadius(['coordinate'], { where: { isRA: true } }, { lat: centerLat, lon: centerLon }, radius)
          .then((results) => {
            if (results) return resolve(results.map(v => ({ lat: v.coordinate.coordinates[1], lon: v.coordinate.coordinates[0] })));
            return resolve();
          });
        // const geoQuery = userGeoFire.query({
        //   center: [centerLat, centerLon],
        //   radius: GeoFire.distance([centerLat, centerLon], [edgeLat, edgeLon])
        // });

        // const p = [];
        // geoQuery.on('key_entered', (_, location) => {
        //   p.push({ lat: location[0], lon: location[1] });
        // });

        // geoQuery.on('ready', () => {
        //   geoQuery.cancel();
        //   resolve(p);
        // });
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
      type: NodeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { id }) => new Promise((resolve, reject) => {
        // refs.node.root.child(id).once('value')
        //   .then((snap) => {
        //     if (snap.val()) {
        //       return resolve(snap.val());
        //     }
        //     return reject(`There is no Node id ${id}`);
        //   });
        mRefs.node.root.findDataById([], id)
          .then((results) => {
            if (results.length > 0) {
              return resolve(results[0]);
            }
            return reject(`There is no Node id ${id}`);
          });
      })

    },
    nodeList: {
      type: new GraphQLList(NodeType),
      args: {
        lat: { type: new GraphQLNonNull(GraphQLFloat) },
        lon: { type: new GraphQLNonNull(GraphQLFloat) },
        radius: { type: new GraphQLNonNull(GraphQLFloat) },
        c1: { type: new GraphQLNonNull(GraphQLString) },
        c2: { type: GraphQLString }
      },
      resolve: (source, { lat, lon, radius, c1, c2 }) => new Promise((resolve) => {
        mRefs.node.root.findDataInsideRadius([], null, { lat, lon }, radius)
          .then((results) => {
            const results2 = results.map(v => ({ ...v, formattedDistance: `${(v.distance / 1000).toFixed(2)}km` }));
            if (c1 === '0') {
              return resolve(results2.sort((a, b) => a.distance - b.distance));
            }
            const c1Result = results2.filter(node => node.c1 === c1).sort((a, b) => a.distance - b.distance);
            if (!c2 || c2 === '0') {
              return resolve(c1Result);
            }
            return resolve(c1Result.filter(node => node.c2 === c2).sort((a, b) => a.distance - b.distance));
          });
        // const geoQuery = nodeGeoFire.query({
        //   center: [lat, lon],
        //   radius
        // });
        // const p = [];
        // geoQuery.on('key_entered', (key, location, d) => {
        //   p.push(new Promise(nResolve => refs.node.root.child(key)
        //       .once('value')
        //       .then(snap => nResolve({ ...snap.val(),
        //         // 1 < d < sqrt(2)
        //         distance: d * 1.2,
        //         formattedDistance: Math.ceil(d * 1.2 * 10) < 10 ?
        //         `${Math.ceil(d * 1.2 * 10) * 100}m` : `${(d * 1.2).toFixed(1)}km`
        //       }))));
        // });

        // geoQuery.on('ready', () => {
        //   Promise.all(p).then((result) => {
        //     if (c1 === 0) {
        //       return resolve(result.sort((a, b) => a.distance - b.distance));
        //     }
        //     const c1Result = result.filter(node => node.c1 === c1).sort((a, b) => a.distance - b.distance);
        //     if (!c2 || c2 === 0) {
        //       return resolve(c1Result);
        //     }
        //     return resolve(c1Result.filter(node => node.c2 === c2).sort((a, b) => a.distance - b.distance));
        //   });
        //   geoQuery.cancel();
        // });
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
