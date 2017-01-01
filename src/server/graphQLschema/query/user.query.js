import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql';
import { PointObject } from 'graphql-geojson';

import mongoose from 'mongoose';

import User from '../type/user.type';
const UserModel = mongoose.model('User');

const UserQuery = {
  users: {
    description: 'List of All users in Pingsters',
    type: new GraphQLList(User),
    resolve: (source, _, { user }) => {
      return new Promise((resolve, reject) => {
        if (user) {
          return UserModel.find()
            .then((userList)=> {
              if (user) {
                resolve(userList);
              } else {
                reject('No user.');
              }
            })
            .catch((err)=> {
              reject(err.message);
            });
        }

        reject('jwt must be provided.');
      });
    },
  },
  user: {
    description: 'UserType by _id',
    type: User,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLString), description: '_id of user.' },
    },
    resolve: (source, { _id }, { user }) => {
      return new Promise((resolve, reject) => {
        if (user) {
          return UserModel.findOne({ _id: _id })
            .then((user)=> {
              if (user) {
                resolve(user);
              } else {
                reject('No user.');
              }
            })
            .catch((err)=> {
              reject(err.message);
            });
        }

        reject('jwt must be provided.');
      });
    },
  },
  viewer: {
    description: 'Logged in user.',
    type: User,
    resolve: (source, _, { user }) => {
      return new Promise((resolve, reject) => {
        if (user) {
          return UserModel.findOne({ _id: user._id })
            .then((user)=> {
              if (user) {
                resolve(user);
              } else {
                reject('No user.');
              }
            })
            .catch((err)=> {
              reject(err.message);
            });
        }

        reject('jwt must be provided.');
      });
    },
  },
  enteredUsers: {
    description: 'List of users in device screen area.',
    type: new GraphQLList(User),
    args: {
      bottomLeft: { type: new GraphQLList(GraphQLFloat), description: 'bottomLeft' },
      upperRight: { type: new GraphQLList(GraphQLFloat), description: 'upperRight' },
    },
    resolve: (source, { bottomLeft, upperRight }, { user }) => {
      return new Promise((resolve, reject) => {
          const query = UserModel.find({
            point: {
              $geoWithin: {
                $box: [bottomLeft, upperRight],
              },
            },
          });
          return query.exec().then((users) => resolve(users));
      });
    },
  },
};

export default UserQuery;
