import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';

import CoordinateType from './coordinate.type';
import {
  refs
} from '../util/firebase/firebase.database.util';

const NodeType = new GraphQLObjectType({
  name: 'node',
  description: 'NodeType of Yetta',
  fields: () => ({
    id: { type: GraphQLString },
    n: { type: GraphQLString },
    p: { type: GraphQLString },
    type: { type: GraphQLString },
    imgUrl: { type: GraphQLString },
    addr: { type: GraphQLString },
    c1: { type: GraphQLString },
    c2: { type: GraphQLString },
    like: { type: GraphQLInt },
    cAt: { type: GraphQLFloat },
    distance: { type: GraphQLFloat },
    formattedDistance: { type: GraphQLString },
    coordinate: {
      type: CoordinateType,
      resolve: source => new Promise((resolve, reject) => {
        refs.node.coordinate.child(source.id).once('value')
          .then(snap => resolve({ lat: snap.val().l[0], lon: snap.val().l[1] }))
          .catch(reject);
      }) }
  })
});

export default NodeType;
