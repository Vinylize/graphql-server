import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
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
    pSAt: { type: GraphQLInt },
    pFAt: { type: GraphQLInt },
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
    RSAt: { type: GraphQLInt },
    dC: { type: GraphQLInt },
    rC: { type: GraphQLInt },
    rImg: { type: GraphQLString },

    isExp: { type: GraphQLBoolean },
    items: { type: new GraphQLList(ItemType) },
    EDP: { type: GraphQLInt },
    RDP: { type: GraphQLInt },
    itemP: { type: GraphQLInt },
    cAt: { type: GraphQLInt },
  })
});

export default OrderType;
