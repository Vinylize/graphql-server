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
    addr: { type: GraphQLString },
    c1: { type: GraphQLString },
    c2: { type: GraphQLString },
    like: { type: GraphQLInt },
    cAt: { type: GraphQLInt },
    distance: { type: GraphQLFloat }
  })
});

export default NodeType;
