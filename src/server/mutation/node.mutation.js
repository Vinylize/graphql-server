import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  defaultSchema,
  refs,
} from '../util/firebase/firebase.database.util';

import {
  nodeGeoFire
} from '../util/firebase/firebase.geofire.util';

const createNodeFromAdminMutation = {
  name: 'createNodeFromAdmin',
  inputFields: {
    n: { type: new GraphQLNonNull(GraphQLString) },
    p: { type: GraphQLString },
    addr: { type: new GraphQLNonNull(GraphQLString) },
    c1: { type: new GraphQLNonNull(GraphQLInt) },
    c2: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: (
    {
      n,
      imgUrl,
      p,
      addr,
      c1,
      c2,
      type,
      lat,
      lon
    }, { user }
    ) => new Promise((resolve, reject) => {
      if (user) {
      // Create new node root in firebase.
        const newRef = refs.node.root.push();
        const newNodeKey = newRef.key;
        return newRef.set({
          id: newNodeKey,
          n,
          p,
          addr,
          c1,
          c2,
          type,
          cAt: Date.now(),
          ...defaultSchema.node.root
        })
        // Create new nodePriperties in firebase.
        .then(() => nodeGeoFire.set(newNodeKey, [lat, lon])
          .then(() => null, (error) => {
            reject(error);
          }))
        .then(() => {
          resolve({ result: newNodeKey });
        })
        .catch(reject);
      }
      return reject('This mutation needs accessToken.');
    })
};

// const createNodeFromPartnerMutation = {
//   name: 'createNodeFromPartner',
//   inputFields: {
//     name: { type: new GraphQLNonNull(GraphQLString) },
//     addr: { type: new GraphQLNonNull(GraphQLString) },
//     c1: { type: new GraphQLNonNull(GraphQLString) },
//     c2: { type: new GraphQLNonNull(GraphQLString) },
//     type: { type: new GraphQLNonNull(GraphQLString) },
//     lat: { type: new GraphQLNonNull(GraphQLFloat) },
//     lon: { type: new GraphQLNonNull(GraphQLFloat) },
//   },
//   outputFields: {
//     result: {
//       type: GraphQLString,
//       resolve: payload => payload.result
//     }
//   },
//   mutateAndGetPayload: () => {
//   }
// };

const NodeMutation = {
  createNodeFromAdmin: mutationWithClientMutationId(createNodeFromAdminMutation),
  // createNodeFromPartner: mutationWithClientMutationId(createNodeFromPartnerMutation),
};

export default NodeMutation;
