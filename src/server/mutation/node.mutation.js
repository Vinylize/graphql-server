import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,

} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  defaultSchema,
  refs
} from '../util/firebase.util';

import {
  nodeGeoFire
} from '../util/firebase.geofire.util';

const createNodeFromAdminMutation = {
  name: 'createNodeFromAdmin',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    address: { type: new GraphQLNonNull(GraphQLString) },
    category1: { type: new GraphQLNonNull(GraphQLString) },
    imageUrl: { type: GraphQLString },
    category2: { type: GraphQLString },
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
      name,
      imageUrl,
      phone,
      address,
      category1,
      category2,
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
          name,
          imageUrl: imageUrl || null,
          phone,
          address,
          category1,
          category2,
          type,
          createdAt: Date.now(),
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

const createNodeFromPartnerMutation = {
  name: 'createNodeFromPartner',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    category1: { type: new GraphQLNonNull(GraphQLString) },
    category2: { type: new GraphQLNonNull(GraphQLString) },
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
  mutateAndGetPayload: () => {
  }
};

const NodeMutation = {
  createNodeFromAdmin: mutationWithClientMutationId(createNodeFromAdminMutation),
  createNodeFromPartner: mutationWithClientMutationId(createNodeFromPartnerMutation),
};

export default NodeMutation;
