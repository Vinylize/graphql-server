import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserType from '../type/user.type';
import firebase from '../util/firebase.util';

const ReportMutation = {
  createReport: mutationWithClientMutationId({
    name: 'createReport',
    inputFields: {},
    outputFields: {
      result: {
        type: GraphQLString,
        resolve: (payload) => payload.result
      }
    },
    mutateAndGetPayload: ({}) => {
    }
  })
};

export default ReportMutation;
