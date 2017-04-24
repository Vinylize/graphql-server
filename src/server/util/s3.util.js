import aws from 'aws-sdk';

aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({ region: 'ap-northeast-2' });
const s3BucketName = process.env.S3_BUCKET_NAME;
const s3BaseUrl = 'https://s3.ap-northeast-2.amazonaws.com/';

const s3Keys = {
  node: 'nodeImage',
  profile: 'profileImage',
  id: 'idImage'
};

export {
  s3,
  s3BaseUrl,
  s3BucketName,
  s3Keys,
};

