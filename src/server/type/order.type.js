import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

import UserType from './user.type';

const ItemType = new GraphQLInputObjectType({
  name: 'Item',
  fields: () => ({
    nId: { type: GraphQLString },
    iId: { type: GraphQLString },
    cnt: { type: GraphQLInt },
    price: { type: GraphQLInt },
    curr: { type: GraphQLInt },
    pSAt: { type: GraphQLFloat },
    pFAt: { type: GraphQLFloat },
// if custom type
    iName: { type: GraphQLString },
    iPr: { type: GraphQLFloat }
  })
});

const OrderType = new GraphQLObjectType({
  name: 'Connection',
  description: 'OrderType of User.',
  fields: () => ({
    id: { type: GraphQLString },
    oId: { type: UserType },
    rId: { type: UserType },
    RSAt: { type: GraphQLFloat },
    dC: { type: GraphQLInt },
    rC: { type: GraphQLInt },
    rImg: { type: GraphQLString },
    eAt: { type: GraphQLFloat },
    items: { type: new GraphQLList(ItemType) },
    EDP: { type: GraphQLInt },
    RDP: { type: GraphQLInt },
    itemP: { type: GraphQLInt },
    cAt: { type: GraphQLFloat },
  })
});

export default OrderType;
