import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import UserType from './user.type';
import OrderType from './order.type';

const NodeType = new GraphQLObjectType({
  name: 'node',
  description: 'NodeType of Yetta',
  fields: () => ({
    id: { type: GraphQLString },
    reporter: { type: UserType },
    connection: { type: OrderType },
    category: { type: GraphQLInt },
    contents: { type: GraphQLString },
    createdAt: { type: GraphQLInt }
  })
});

export default NodeType;
