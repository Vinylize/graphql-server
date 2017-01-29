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

const connectionOpenPortMutation = {
  name: 'connectionOpenPort',
  inputFields: {
    category: {type: new GraphQLNonNull(GraphQLString)},
    subCategory: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    result: {
      type: GraphQLString,
      resolve: (payload) => payload.result
    }
  },
  mutateAndGetPayload: ({category, subCategory}, {user}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        return firebase.refs.connection.push({
          port: user.uid,
          category,
          subCategory,
          ...firebase.defaultSchema.connection
        })
          .then(()=> {
            resolve({result: 'OK'});
          })
          .catch(reject);
      } else {
        return reject('This mutation needs accessToken.');
      }
    });
  }
};

const ConnectionMutation = {
  connectionOpenPort: mutationWithClientMutationId(connectionOpenPortMutation)
};

export default ConnectionMutation;
