import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import GraphQLDate from 'graphql-date';

import UserType from './user.type';
import ConnectionType from './connection.type';

const ReportType = new GraphQLObjectType({
  name: 'Snippet',
  description: 'SnippetType of Recbook',
  fields: () => ({
    reporter: { type: UserType },
    connection: { type: ConnectionType},
    category: { type: GraphQLInt },
    contents: { type: GraphQLString },
    createdAt: { type: GraphQLDate }
  })
});

export default ReportType;
