import express from 'express';
import mongoose from './util/mongoose.util.js';
import graphqlHTTP from 'express-graphql';
import schema from './graphQLschema/index';
import jwtUtil from './util/jwt.util';

const apiServer = express();

const PORT = process.env.PORT;

mongoose.connect();

apiServer.post('/graphql', jwtUtil.apiProtector, graphqlHTTP((request) => {
  const startTime = Date.now();
  return {
    schema: schema,
    rootValue: { request },
    extensions() {
      return { runTime: `${Date.now() - startTime}ms` };
    },
  };
}));

apiServer.listen(PORT, () => {
  console.log(`Pingsters api server listening on port ${PORT}!`);
});
