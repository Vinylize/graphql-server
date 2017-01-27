import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import express from 'express';
import graphqlHTTP from 'express-graphql';
import logger from 'winston';

import jwtUtil from './util/jwt.util';
import UserMutation from './mutation/user.mutation';
import ConnectionMutation from './mutation/connection.mutation';
import ReportMutation from './mutation/report.mutation';
import ViewerQuery from './query/viewer.query';

const app = express();
const PORT = process.env.PORT;
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'rootQuery',
    description: 'Root Query of the Recbook Schema',
    fields: () => ({
      ...ViewerQuery
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'rootMutation',
    description: 'Root Mutation of the Recbook Schema',
    fields: () => ({
      ...UserMutation,
      ...ConnectionMutation,
      ...ReportMutation
    })
  })
});

app.post('/graphql', jwtUtil.apiProtector, graphqlHTTP((request) => {
  const startTime = Date.now();
  return {
    schema: schema,
    graphiql: true,
    rootValue: { request },
    extensions(ext) {
      // TODO : Fhtttind why `logger.debug(ext.result)` doesn't work on this part.
      // logger.debug(ext.result);
      console.log(ext.result);
      return { runTime: `${Date.now() - startTime}ms` };
    }
  };
}));

app.listen(PORT, () => {
  logger.info(`Vinyl api server listening on port ${PORT}!`);
});
