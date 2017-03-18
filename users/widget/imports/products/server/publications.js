import { parse } from 'url';

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';

import {
  Subscriptions,
  Products,
  ProductUsers,
  ContentWalls,
  ContentWallCharges,
  KeyValues,
} from 'meteor/drizzle:models';

import { getPath } from '../index';

Meteor.publish('products/userPaygCharges', function userPaygCharges(params) {
  check(params, {
    offset: Number,
    limit: Number,
    all: Boolean,
    productId: String,
  });

  if (!this.userId) { return this.ready(); }

  const filter = { userId: this.userId };
  if (!params.all) {
    filter.productId = params.productId;
  }

  return ContentWallCharges.find(
    filter,
    {
      sort: { createdAt: -1 },
      skip: params.offset, limit: params.limit,
      fields: { userId: 1, productId: 1, url: 1, amount: 1, createdAt: 1, title: 1 },
    }
  );
});

Meteor.publish('products/getContentWallByUrl', (url) => {
  check(url, String);

  const path = getPath(url);
  const fullUrl = `${parse(url).host}${path}`;

  return [
    ContentWalls.find({ url: fullUrl }, { fields: {
      upvotedUserIds: 1,
      url: 1,
      title: 1,
      productId: 1,
      sellCount: 1,
      upvoteCount: 1,
      price: 1,
      'content.thumbnail': 1,
      'content.thumbnails': 1,
      disabled: 1,
      donationEnabled: 1,
      donationMessage: 1,
      donationThankYouMessage: 1,
      disableMicropayment: 1,
      guestButtonText: 1,
      viewportConfig: 1,
      hideUpsellingList: 1,
    } }),
    KeyValues.find({ key: 'stripePublishableKey' }),
  ];
});

Meteor.publish('products/getPurchasedCount', function getPurchasedCount(productId) {
  check(productId, String);

  if (!this.userId) return;

  Counts.publish(this, 'products-purchased-count',
    ContentWallCharges.find({ userId: this.userId, productId })
  );
});

Meteor.publishComposite('widget.product', function widgetProduct(url) {
  check(url, String);

  const domain = parse(url).host;

  const subs = {
    find() {
      return Products.find(
        { domain },
        {
          fields: {
            title: 1,
            description: 1,
            slug: 1,
            url: 1,
            domain: 1,
            createdAt: 1,
            vendorUserId: 1,
            widgetUI: 1,
            paygEnabled: 1,
            defaultWallPrice: 1,
            subscriptionEnabled: 1,
            subscription: 1,
            freeArticleCount: 1,
            freeArticleCountChangedAt: 1,
            sharingDisabled: 1,
            upsellingConfig: 1,
            isFreeTrialEnabled: 1,
            isFooterBarEnabled: 1,
            isFooterBarEnabledOnAllPages: 1,
            isClientSide: 1,
            freeTrialDayCount: 1,
            socialProof: 1,
            guestButtonText: 1,
            guestMessageText: 1,
          },
        }
      );
    },
    children: [],
  };

  if (this.userId) {
    subs.children.push({
      find(product) {
        const now = new Date();
        return Subscriptions.find({
          userId: this.userId,
          productId: product._id,
          beginAt: { $lte: now },
          endAt: { $gte: now },
        });
      },
    });

    subs.children.push({
      find(product) {
        return ProductUsers.find({
          userId: this.userId,
          productId: product._id,
        });
      },
    });
  }

  return subs;
});
