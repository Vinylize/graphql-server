import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLBoolean,
} from 'graphql';
import { PointObject } from 'graphql-geojson';

import GraphQLDate from 'graphql-date';
import mongoose from 'mongoose';

import jwtUtil from '../../util/jwt.util';

const UserModel = mongoose.model('User');

const User = new GraphQLObjectType({
  name: 'User',
  description: 'UserType of Pingsters',
  fields: () => ({
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    deviceUUID: { type: GraphQLString },
    phoneSecretCode: { type: GraphQLString },
    phoneValidAt: { type: GraphQLDate },
    isPhoneValid: { type: GraphQLBoolean },
    validAt: { type: GraphQLDate },
    point: {
      type: PointObject,
      resolve: (source) => ({
        type: 'Point',
        coordinates: source.point,
      }),
    },
    accessToken: {
      description: 'accessToken of user',
      type: GraphQLString,
    },
    createdAt: { type: GraphQLDate },
    friends: {
      description: 'List of friends from user',
      type: new GraphQLList(User),
      resolve: (source) => {
        return UserModel.find({
          _id: { $in: source.friends },
        });
      },
    },
  }),
});

export default User;
