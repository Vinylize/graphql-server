import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import GraphQLDate from 'graphql-date';

import {
  refs
} from '../util/firebase.util';

import UserType from './user.type';

const RewardType = new GraphQLObjectType({
  name: 'Reward',
  description: 'RewardType of Connection.',
  fields: () => ({
    currency: { type: GraphQLString },
    price: { type: GraphQLInt }
  })
});

const GoodsType = new GraphQLObjectType({
  name: 'Goods',
  description: 'GoodsType of Connection.',
  fields: () => ({
    name: {type: GraphQLString},
    category: { type: GraphQLInt },
    dimension: { type: GraphQLString },
    weight: { type: GraphQLInt },
    valueCurrency: { type: GraphQLString },
    valuePrice: { type: GraphQLInt },
    stopoverName: { type: GraphQLString },
    stopoverMainAddress: { type: GraphQLString },
    stopoverSubAddress: { type: GraphQLString },
    stopoverLat: { type: GraphQLFloat },
    stopoverLon: { type: GraphQLFloat }
  })
});

const ConnectionType = new GraphQLObjectType({
  name: 'Connection',
  description: 'OrderType of User.',
  fields: () => ({
    id: { type: GraphQLString },
    port: { type: UserType },
    ship: { type: UserType },
    category: { type: GraphQLInt },
    subCategory: { type: GraphQLInt },
    resultImage: { type: GraphQLString },
    openedAt: { type: GraphQLDate },
    isExpired: { type: GraphQLBoolean },
    reward: { type: RewardType },
    goods: { type: new GraphQLList(GoodsType) }
  })
});

export default ConnectionType;
