import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  refs
} from '../util/firebase.util';

import {
  s3BucketName,
  s3,
  s3BaseUrl,
  s3Keys,
} from '../util/s3.util';

const userUploadProfileImageMutation = {
  name: 'userUploadProfileImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: payload => payload.imageUrl }
  },
  mutateAndGetPayload: (args, { user, file }) => new Promise((resolve, reject) => {
    if (user) {
      if (file) {
        console.log(file);
        console.log('upload file to s3 & firebase here.');
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
    imageUrl: { type: GraphQLString, resolve: payload => payload.imageUrl }
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

const runnerUploadReciptImageMutation = {
  name: 'runnerUploadReciptImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: payload => payload.imageUrl }
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
        console.log(file);
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
    imageUrl: { type: GraphQLString, resolve: payload => payload.imageUrl }
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
