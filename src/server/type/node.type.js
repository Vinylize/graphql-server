import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';

const NodeType = new GraphQLObjectType({
  name: 'node',
  description: 'NodeType of Yetta',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    phone: { type: GraphQLString },
    type: { type: GraphQLString },
    address: { type: GraphQLString },
    category1: { type: GraphQLString },
    category2: { type: GraphQLString },
    like: { type: GraphQLInt },
    createdAt: { type: GraphQLInt },
    distanceFromMe: { type: GraphQLFloat }
  })
});

export default NodeType;
