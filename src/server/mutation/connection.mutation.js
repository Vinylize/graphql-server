import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import firebase from '../util/firebase.util';
import UserType from '../type/user.type';
import ConnectionType from '../type/connection.type';


const ConnectionMutation = {
  createConnection: mutationWithClientMutationId({
    name: 'createConnection',
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

export default ConnectionMutation;
