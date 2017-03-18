import url from 'url';

import { Meteor } from 'meteor/meteor';
import { AWS } from 'meteor/peerlibrary:aws-sdk';

AWS.config.update({
  accessKeyId: Meteor.settings.AWSAccessKeyId,
  secretAccessKey: Meteor.settings.AWSSecretAccessKey,
});

export function deleteObject(objectUrl) {
  const p = url.parse(objectUrl);
  let path = p.pathname;
  if (path.startsWith('/')) {
    path = path.substr(1);
  }

  const s3 = new AWS.S3();
  const params = {
    Bucket: Meteor.settings.S3bucket,
    Key: path,
  };

  return s3.deleteObjectSync(params);
}

export function putObject(params) {
  const s3 = new AWS.S3();

  return s3.putObjectSync(params);
}

export function getSignedUrl(params) {
  const s3 = new AWS.S3();

  return s3.getSignedUrl('getObject', params);
}
