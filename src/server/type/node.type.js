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
    n: { type: GraphQLString },
    p: { type: GraphQLString },
    type: { type: GraphQLString },
    imgUrl: { type: GraphQLString },
    addr: { type: GraphQLString },
    c1: { type: GraphQLString },
    c2: { type: GraphQLString },
    like: { type: GraphQLInt },
    cAt: { type: GraphQLFloat },
    distance: { type: GraphQLFloat },
    formattedDistance: { type: GraphQLString },
  })
});

export default NodeType;
