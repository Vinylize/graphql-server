import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import UserType from './user.type';
import OrderType from './order.type';

const PartnerType = new GraphQLObjectType({
  name: 'partner',
  description: 'PartnerType of yetta.',
  fields: () => ({
    id: { type: GraphQLString },
    reporter: { type: UserType },
    connection: { type: OrderType },
    category: { type: GraphQLInt },
    contents: { type: GraphQLString },
    createdAt: { type: GraphQLInt }
  })
});

export default PartnerType;
