import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { buildSearchExp } from 'meteor/drizzle:util';
import { Products, ContentWalls, Categories } from 'meteor/drizzle:models';

Meteor.publish('contentWalls/listByProduct', function listByProduct(params) {
  check(params, {
    offset: Number,
    limit: Number,
    productId: String,
    search: Match.Optional(String), // eslint-disable-line new-cap
    sort: Match.Optional(String), // eslint-disable-line new-cap
    categoryId: Match.Optional(String), // eslint-disable-line new-cap
    sorting: {
      viewCount: Match.Optional(Number), // eslint-disable-line new-cap
      uniqueViewCount: Match.Optional(Number), // eslint-disable-line new-cap
      callToActionClickedCount: Match.Optional(Number), // eslint-disable-line new-cap
      footerButtonClickedCount: Match.Optional(Number), // eslint-disable-line new-cap
      registeredUserCount: Match.Optional(Number), // eslint-disable-line new-cap
      freeTrialSubscribedUserCount: Match.Optional(Number), // eslint-disable-line new-cap
      sellCount: Match.Optional(Number), // eslint-disable-line new-cap
      subscribedUserCount: Match.Optional(Number), // eslint-disable-line new-cap
      visitedCountViaUpselling: Match.Optional(Number), // eslint-disable-line new-cap
      subscriberVisitedCount: Match.Optional(Number), // eslint-disable-line new-cap
      dailyAccessSoldCount: Match.Optional(Number), // eslint-disable-line new-cap
    },
  });

  if (!this.userId) {
    return this.ready();
  }

  const { productId } = params;
  const filter = { productId };

  if (params.categoryId) {
    filter.categoryIds = params.categoryId;
  }

  if (params.search) {
    const regExp = buildSearchExp(params.search);
    filter.$or = [
      { url: regExp },
      { title: regExp },
    ];
  }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return this.ready();
  }

  const sort = _.isEmpty(params.sorting) ? { createdAt: -1 } : params.sorting;

  const options = {
    sort,
    skip: params.offset, limit: params.limit,
    fields: {
      productId: 1, url: 1, createdAt: 1, key: 1, sellCount: 1, autoDecryption: 1,
      totalIncome: 1, content: 1, price: 1, disabled: 1, viewCount: 1,
      isEncryptedContentIntalled: 1, cpm: 1, isActive: 1, uniqueViewCount: 1,
      fixedPricing: 1, popularity: 1, autoDecryptionConfig: 1, title: 1, isVideo: 1,
      leadGeneration: 1, subscriptionPlanIds: 1,
      disableMeteredPaywall: 1, expirationHours: 1, donationMessage: 1, donationThankYouMessage: 1,
      donationEnabled: 1, expirationEnabled: 1,
      sharedCounts: 1, disableMicropayment: 1, guestButtonText: 1, categoryIds: 1,
      callToActionClickedCount: 1, registeredUserCount: 1, subscribedUserCount: 1,
      freeTrialSubscribedUserCount: 1, isDailyAccessEnabled: 1, visitedCountViaUpselling: 1,
      hideUpsellingList: 1, dailyAccessSoldCount: 1, subscriberVisitedCount: 1,
      footerButtonClickedCount: 1,
    },
  };

  if (params.sort === 'income') {
    options.sort = { totalIncome: -1 };
  }

  return ContentWalls.find(filter, options);
});

Meteor.publish('contentWalls/getById', function getById(id) {
  check(id, String);

  if (!this.userId) {
    return this.ready();
  }

  const wall = ContentWalls.findOne(id, { fields: { productId: 1 } });
  if (!wall) {
    return this.ready();
  }

  const product = Products.findOne(wall.productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return this.ready();
  }

  const options = {
    fields: {
      productId: 1, url: 1, createdAt: 1, key: 1, sellCount: 1, autoDecryption: 1,
      totalIncome: 1, content: 1, price: 1, disabled: 1, viewCount: 1,
      isEncryptedContentIntalled: 1, cpm: 1, isActive: 1, uniqueViewCount: 1,
      fixedPricing: 1, popularity: 1, autoDecryptionConfig: 1, title: 1, isVideo: 1,
      leadGeneration: 1, subscriptionPlanIds: 1,
      disableMeteredPaywall: 1, expirationHours: 1, donationMessage: 1, donationThankYouMessage: 1,
      donationEnabled: 1, expirationEnabled: 1, categoryIds: 1,
      sharedCounts: 1, disableMicropayment: 1, guestButtonText: 1, viewportConfig: 1,
      callToActionClickedCount: 1, registeredUserCount: 1, subscribedUserCount: 1,
      freeTrialSubscribedUserCount: 1, isDailyAccessEnabled: 1, visitedCountViaUpselling: 1,
      hideUpsellingList: 1, dailyAccessSoldCount: 1, subscriberVisitedCount: 1,
      footerButtonClickedCount: 1,
    },
  };

  return ContentWalls.find(id, options);
});

Meteor.publish('contentWalls.categories', function categoryListByProduct(productId) {
  check(productId, String);

  if (!this.userId) {
    return this.ready();
  }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return this.ready();
  }

  return Categories.find({ productId });
});
