import {
  GraphQLString,
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

const NodeMutation = {
  createNode: mutationWithClientMutationId({
    name: 'createNode',
    inputFields: {},
    outputFields: {
      result: {
        type: GraphQLString,
        resolve: payload => payload.result
      }
    },
    mutateAndGetPayload: () => {
    }
  })
};

export default NodeMutation;
