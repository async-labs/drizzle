import path from 'path';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.createDirective('uploadWidgetUIImage', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3bucket,
  maxSize: 0.5 * 1024 * 1024,
  allowedFileTypes: ['image/png', 'image/jpeg'],
  acl: 'public-read',
  region: 'us-west-1',

  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error('login-Required', 'Please login!');
    }

    return true;
  },

  key(file, metaContext) {
    if (!metaContext.width || metaContext.width !== 300) {
      throw Meteor.Error('wrong-dimension', 'Can upload image with 300px width');
    }
    if (!metaContext.height || metaContext.height !== 120) {
      throw Meteor.Error('wrong-dimension', 'Can upload image with 120px width');
    }

    return `widget-images/${this.userId}/${Random.id()}${path.extname(file.name)}`;
  },
});

Slingshot.createDirective('uploadContentWallThumbnail', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3bucket,
  maxSize: 0.5 * 1024 * 1024,
  allowedFileTypes: ['image/png', 'image/jpeg'],
  acl: 'public-read',
  region: 'us-west-1',

  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error('login-Required', 'Please login!');
    }

    return true;
  },

  key(file) {
    return `content-wall-images/${this.userId}/${Random.id()}${path.extname(file.name)}`;
  },
});
