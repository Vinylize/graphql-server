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
  GraphQLInputObjectType
} from 'graphql';
import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import mongoose from 'mongoose';

import jwtUtil from '../../util/jwt.util';
import User from '../type/user.type';

const UserModel = mongoose.model('User');

const UserMutation = {
  createUser: mutationWithClientMutationId({
    name: 'createUser',
    inputFields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      user: {
        type: User,
        resolve: (payload) => payload,
      },
    },
    mutateAndGetPayload: (args) => {
      return new Promise((resolve, reject) => {
        UserModel.create(args)
          .then((user)=> {
            user.accessToken = jwtUtil.createAccessToken(user);
            resolve(user);
          })

          .catch((err)=> {
            reject(err.message);
          });
      });
    },
  }),
  getToken: mutationWithClientMutationId({
    name: 'getToken',
    inputFields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      user: {
        type: User,
        resolve: (payload) => payload,
      },
    },
    mutateAndGetPayload: ({ email, password }) => {
      console.log(email, password);
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: email })
          .then((user)=> {
            if (user) {
              user.comparePassword(password, (err, isMatch) => {
                if (isMatch) {
                  user.accessToken = jwtUtil.createAccessToken(user);
                  return resolve(user);
                }

                return reject('Wrong password.');
              });

            } else {
              return reject('Not registered.');
            }
          })
          .catch((err)=> {
            reject(err.message);
          });
      });
    },
  }),
};

export default UserMutation;
