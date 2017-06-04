import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  refs
} from '../util/firebase/firebase.database.util';

import {
  mRefs
} from '../util/sequelize/sequelize.database.util';

import {
  s3BucketName,
  s3,
  s3BaseUrl,
  s3Keys,
} from '../util/s3.util';

function decodeBase64Image(dataString) {
  /* eslint-disable */
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  /* eslint-enable */
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

const userUploadProfileImageMutation = {
  name: 'userUploadProfileImage',
  description: '',
  inputFields: {},
  outputFields: {
    imgUrl: { type: GraphQLString, resolve: payload => payload.imgUrl }
  },
  mutateAndGetPayload: (args, { user, body }) => new Promise((resolve, reject) => {
    const file = decodeBase64Image(body.file);
    if (user) {
      if (file) {
        const key = `${s3Keys.profile}/${user.uid}.png`;
        const params = {
          Bucket: s3BucketName,
          Key: key,
          ACL: 'public-read',
          Body: file.data
        };

        return s3.putObject(params, (err) => {
          if (err) {
            return reject(err);
          }
          const imgUrl = `${s3BaseUrl}${s3BucketName}/${key}`;
          return refs.user.root.child(user.uid).child('pUrl').set(imgUrl)
            // mysql
            .then(() => mRefs.user.root.updateData({ pUrl: imgUrl }, { row_id: user.uid }))
            .then(() => resolve({ imgUrl }));
        });
      }
      return reject('invalid or no file.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const userUploadIdImageMutation = {
  name: 'userUploadIdImage',
  description: '',
  inputFields: {},
  outputFields: {
    imgUrl: { type: GraphQLString, resolve: payload => payload.imgUrl }
  },
  mutateAndGetPayload: (args, { user, body }) => new Promise((resolve, reject) => {
    const file = decodeBase64Image(body.file);
    if (user) {
      if (file) {
        const key = `${s3Keys.id}/${user.uid}.png`;
        const params = {
          Bucket: s3BucketName,
          Key: key,
          ACL: 'public-read',
          Body: file.data
        };

        return s3.putObject(params, (err) => {
          if (err) {
            return reject(err);
          }
          const imgUrl = `${s3BaseUrl}${s3BucketName}/${key}`;
          return refs.user.root.child(user.uid).child('idUrl').set(imgUrl)
          // mysql
            .then(() => mRefs.user.root.updateData({ idUrl: imgUrl }, { row_id: user.uid }))
            .then(() => resolve({ imgUrl }));
        });
      }
      return reject('invalid or no file.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const runnerUploadReciptImageMutation = {
  name: 'runnerUploadReciptImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: payload => payload.imgUrl }
  },
  mutateAndGetPayload: (args, { user, file }) => new Promise((resolve, reject) => {
    if (user) {
      if (file) {
        console.log('upload file to s3 & firebase here.');
      }
      return reject('invalid or no file.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const uploadNodeImageMutation = {
  name: 'uploadNodeImage',
  description: '',
  inputFields: {
    nodeId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    imgUrl: { type: GraphQLString, resolve: payload => payload.imgUrl }
  },
  mutateAndGetPayload: ({ nodeId }, { user, file }) => new Promise((resolve, reject) => {
    if (user) {
      if (file) {
        const key = `${s3Keys.node}/${nodeId}.png`;
        const params = {
          Bucket: s3BucketName,
          Key: key,
          ACL: 'public-read',
          Body: file.buffer
        };

        return s3.putObject(params, (err) => {
          if (err) {
            return reject(err);
          }
          const imgUrl = `${s3BaseUrl}${s3BucketName}/${key}`;
          return refs.node.root.child(nodeId).child('imgUrl').set(imgUrl)
          // mysql
            .then(() => mRefs.node.root.updateData({ imgUrl }, { row_id: user.uid }))
            .then(() => resolve({ imgUrl }));
        });
      }
      return reject('There is no image.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const uploadNodeItemImageMutation = {
  name: 'uploadNodeItemImage',
  description: '',
  inputFields: {},
  outputFields: {
    imgUrl: { type: GraphQLString, resolve: payload => payload.imgUrl }
  },
  mutateAndGetPayload: (args, { user, file }) => new Promise((resolve, reject) => {
    if (user) {
      if (file) {
        console.log('upload file to s3 & firebase here.');
      }
      return reject('invalid or no file.');
    }
    return reject('This mutation needs accessToken.');
  })
};

const UploadMutation = {
  userUploadProfileImage: mutationWithClientMutationId(userUploadProfileImageMutation),
  userUploadIdImage: mutationWithClientMutationId(userUploadIdImageMutation),
  runnerUploadReciptImage: mutationWithClientMutationId(runnerUploadReciptImageMutation),
  uploadNodeImage: mutationWithClientMutationId(uploadNodeImageMutation),
  uploadNodeItemImage: mutationWithClientMutationId(uploadNodeItemImageMutation)
};

export default UploadMutation;
