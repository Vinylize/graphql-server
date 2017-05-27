import {
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

const CoordinateType = new GraphQLObjectType({
  name: 'coordinate',
  description: 'CoordinateType of user.',
  fields: () => ({
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat }
  })
});

export default CoordinateType;
