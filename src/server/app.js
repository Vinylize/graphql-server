import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer from 'multer';
import logger from 'winston';

import authUtil from './util/auth.util';

import UserMutation from './mutation/user.mutation';
import OrderMutation from './mutation/order.mutation';
import NodeMutation from './mutation/node.mutation';
import PartnerMutation from './mutation/partner.mutation';
import UploadMutation from './mutation/upload.mutation';
import PushMutation from './mutation/push.mutation';

import ViewerQuery from './query/viewer.query';
import UploadQuery from './query/upload.query';


const server = (afterServerStartCallback) => {
  const app = express();
  const PORT = process.env.PORT;

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,authorization,content-type');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
  });

// General Endpoint

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'rootQuery',
      description: 'Root Query of the Yetta Schema',
      fields: () => ({
        ...ViewerQuery
      })
    }),
    mutation: new GraphQLObjectType({
      name: 'rootMutation',
      description: 'Root Mutation of the Yetta Schema',
      fields: () => ({
        ...UserMutation,
        ...OrderMutation,
        ...NodeMutation,
        ...PartnerMutation,
        ...PushMutation,
      })
    })
  });

  app.post(
    '/graphql',
    authUtil.apiProtector,
    graphqlHTTP((request) => {
      const startTime = Date.now();
      return {
        schema,
        rootValue: { request },
        extensions(ext) {
          // TODO : Find why `logger.debug(ext.result)` doesn't work on this part.
          // logger.debug(ext.result);
          console.log(ext.result);
          return { runTime: `${Date.now() - startTime}ms` };
        }
      };
    }));

// Upload Endpoint

  const uploadSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'rootQuery',
      description: 'Root Upload Query of the Yetta Schema',
      fields: () => ({
        ...UploadQuery
      })
    }),
    mutation: new GraphQLObjectType({
      name: 'rootMutation',
      description: 'Root Upload Mutation of the Yetta Schema',
      fields: () => ({
        ...UploadMutation
      })
    })
  });

  const storage = multer.memoryStorage();

  app.post(
    '/graphql/upload',
    authUtil.apiProtector,
    multer({ storage }).single('file'),
    graphqlHTTP((request) => {
      const startTime = Date.now();
      return {
        schema: uploadSchema,
        rootValue: { request },
        extensions(ext) {
          // TODO : Find why `logger.debug(ext.result)` doesn't work on this part.
          // logger.debug(ext.result);
          console.log(ext.result);
          return { runTime: `${Date.now() - startTime}ms` };
        }
      };
    }));

  app.listen(PORT, () => {
    if (afterServerStartCallback) {
      afterServerStartCallback();
    }
  });
};

if (process.env.NODE_ENV !== 'test') {
  server(() => {
    logger.info(`Vinyl api server listening on port ${process.env.PORT}!`);
  });
}

export default server;
