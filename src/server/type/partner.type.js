import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

const PartnerType = new GraphQLObjectType({
  name: 'partner',
  description: 'PartnerType of yetta.',
  fields: () => ({
    id: { type: GraphQLString },
    pw: { type: GraphQLString },
    name: { type: GraphQLString },
    p: { type: GraphQLString },
    cAt: { type: GraphQLFloat }
  })
});

export default PartnerType;
