import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import GraphQLDate from 'graphql-date';

import firebase from '../util/firebase.util';
import UserType from './user.type';
import ReportType from './report.type';

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
  description: 'ConnectionType of User.',
  fields: () => ({
    port: { type: UserType },
    ship: { type: UserType },
    category: { type: GraphQLInt },
    subCategory: { type: GraphQLInt },
    resultImage: { type: GraphQLString },
    openedAt: { type: GraphQLDate },
    isExpired: { type: GraphQLBoolean },
    reward: { type: RewardType },
    goods: { type: new GraphQLList(GoodsType) },
    reports: { type: new GraphQLList(ReportType) }
  })
});

export default ConnectionType;
