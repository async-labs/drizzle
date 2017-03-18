import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { KeyValues, ContentWalls } from 'meteor/drizzle:models';

Meteor.publish('recommendation/topUrls', function topUrls(params) { // eslint-disable-line
  check(params, {
    productId: String,
    wallId: Match.Optional(String), // eslint-disable-line new-cap
    all: Boolean,
    limit: Number,
  });

  const config = KeyValues.findOne({ key: 'upsellingConfig' }) || { value: {} };

  const filter = {
    disabled: false,
    sellCount: { $gte: config.value.purchasedCount || 0 },
    upvoteCount: { $gte: config.value.upvoteCount || 0 },
  };

  if (params.wallId) {
    filter._id = { $ne: params.wallId };
  }

  if (!params.all) {
    filter.productId = params.productId;
  }

  const options = {
    limit: params.limit,
    sort: { popularity: -1 },
    fields: {
      url: 1,
      productId: 1,
      title: 1,
      disabled: 1,
      isActive: 1,
      isEncryptedContentIntalled: 1,
      popularity: 1,
      sellCount: 1,
      upvoteCount: 1,
      score: 1,
      thumbnailUrl: 1,
      description: 1,
      createdAt: 1,
    },
  };

  return ContentWalls.find(filter, options);
});

Meteor.publish('recommendation/newest', function newest(params) { // eslint-disable-line
  check(params, {
    productId: String,
    wallId: Match.Optional(String), // eslint-disable-line new-cap
    all: Boolean,
    limit: Number,
  });

  const filter = {
    disabled: false,
  };

  if (params.wallId) {
    filter._id = { $ne: params.wallId };
  }

  if (!params.all) {
    filter.productId = params.productId;
  }

  const options = {
    limit: params.limit,
    sort: { createdAt: -1 },
    fields: {
      url: 1,
      productId: 1,
      title: 1,
      disabled: 1,
      isActive: 1,
      isEncryptedContentIntalled: 1,
      popularity: 1,
      sellCount: 1,
      upvoteCount: 1,
      score: 1,
      thumbnailUrl: 1,
      description: 1,
      createdAt: 1,
    },
  };

  return ContentWalls.find(filter, options);
});
