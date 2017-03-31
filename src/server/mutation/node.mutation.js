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

const createNodeFromAdminMutation = {
  name: 'createNodeFromAdmin',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    category1: { type: new GraphQLNonNull(GraphQLString) },
    category2: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lng: { type: new GraphQLNonNull(GraphQLFloat) },
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: payload => payload.result
    }
  },
  mutateAndGetPayload: ({ name, address, category1, category2, type, lat, lng }, { user }) => new Promise((resolve, reject) => {
    if (user) {
      // Create new node root in firebase.
      const newRef = refs.node.root.push();
      const newNodeKey = newRef.key;
      return newRef.set({
        id: newNodeKey,
        name,
        address,
        category1,
        category2,
        type,
        createdAt: Date.now(),
        ...defaultSchema.node.root
      })
      // Create new nodePriperties in firebase.
        .then(() => refs.node.coordinate.child(newNodeKey).set({
          lat,
          lng,
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
