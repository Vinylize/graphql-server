import {
  GraphQLString
} from 'graphql';

const UploadQuery = {
  viewer: {
    description: 'Upload query. This is Useless.',
    type: GraphQLString,
    resolve: (source, _, { user }) => {}
  }
};

export default UploadQuery;
