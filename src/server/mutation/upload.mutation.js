import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  admin,
  defaultSchema,
  refs
} from '../util/firebase.util';

const userUploadProfileImageMutation = {
  name: 'userUpdateProfileImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: (payload) => payload.imageUrl }
  },
  mutateAndGetPayload: (args, {user, file}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        if (file) {
          console.log('upload file to s3 & firebase here.');
        }
        return reject('invalid or no file.');
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const userUploadIdImageMutation = {
  name: 'userUploadIdImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: (payload) => payload.imageUrl }
  },
  mutateAndGetPayload: (args, {user, file}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        if (file) {
          console.log('upload file to s3 & firebase here.');
        }
        return reject('invalid or no file.');
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const runnerUploadReciptImageMutation = {
  name: 'runnerUploadReciptImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: (payload) => payload.imageUrl }
  },
  mutateAndGetPayload: (args, {user, file}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        if (file) {
          console.log('upload file to s3 & firebase here.');
        }
        return reject('invalid or no file.');
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const uploadNodeImageMutation = {
  name: 'uploadNodeImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: (payload) => payload.imageUrl }
  },
  mutateAndGetPayload: (args, {user, file}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        if (file) {
          console.log('upload file to s3 & firebase here.');
        }
        return reject('invalid or no file.');
      }
      return reject('This mutation needs accessToken.');
    });
  }
};

const uploadNodeItemImageMutation = {
  name: 'uploadNodeItemImage',
  description: '',
  inputFields: {},
  outputFields: {
    imageUrl: { type: GraphQLString, resolve: (payload) => payload.imageUrl }
  },
  mutateAndGetPayload: (args, {user, file}) => {
    return new Promise((resolve, reject) => {
      if (user) {
        if (file) {
          console.log('upload file to s3 & firebase here.');
        }
        return reject('invalid or no file.');
      }
      return reject('This mutation needs accessToken.');
    });
  }
};



const UploadMutation = {
  userUploadProfileImage: mutationWithClientMutationId(userUploadProfileImageMutation),
  userUploadIdImage: mutationWithClientMutationId(userUploadIdImageMutation),
  runnerUploadReciptImage: mutationWithClientMutationId(runnerUploadReciptImageMutation),
  uploadNodeImageMutation: mutationWithClientMutationId(uploadNodeImageMutation),
  uploadNodeItemImageMutation: mutationWithClientMutationId(uploadNodeItemImageMutation)
};

export default UploadMutation;
