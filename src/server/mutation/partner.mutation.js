import {
  GraphQLString,
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

const PartnerMutation = {
  createPartner: mutationWithClientMutationId({
    name: 'createPartner',
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

export default PartnerMutation;
