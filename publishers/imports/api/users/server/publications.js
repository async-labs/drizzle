import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { check } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Products, Plans, ProductUsers } from 'meteor/drizzle:models';

import { buildFilterQuery } from '/imports/api/users/lib/query-builder';
import { FilterQuerySchema } from '/imports/api/users/lib/shared-schemas';

Meteor.publish(null, function loggedUser() {
  if (!this.userId) { return this.ready(); }

  return Meteor.users.find(this.userId, {
    fields: {
      notifications: 1,
      slug: 1,
      vendorStatus: 1,
      payoutConfig: 1,
      incomeBalance: 1,
      incomeCurrentBalance: 1,
      subscriptionBalance: 1,
      subscriptionCurrentBalance: 1,
      paygBalance: 1,
      paygCurrentBalance: 1,
      registeredAt: 1,
      mailchimpConfig: 1,
      resetPasswordRequestedUrl: 1,
    },
  });
});

Meteor.publish('productUsers.counters', function counters(params) {
  check(params, FilterQuerySchema);

  const { searchQuery, startDate, endDate, productId } = params;
  const countParams = {
    productId,
    searchQuery,
    startDate,
    endDate,
  };

  Counts.publish(this,
    'productUsers.counters.all',
    ProductUsers.find(buildFilterQuery(countParams)),
  );

  Counts.publish(
    this,
    'productUsers.counters.isRegisteredAtIt',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isRegisteredAtIt: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isMicropaid',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isMicropaid: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isBoughtDailyAccess',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isBoughtDailyAccess: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isUnlockedFreeContent',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isUnlockedFreeContent: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isUsedFreeTrial',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isUsedFreeTrial: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isReferrer',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { filteisReferrer: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isReferred',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isReferred: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isSubscribed',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isSubscribed: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isUnsubscribed',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isUnsubscribed: true } },
    })),
  );

  Counts.publish(
    this,
    'productUsers.counters.isCancelledFreeTrial',
    ProductUsers.find(buildFilterQuery({
      ...countParams,
      ...{ filter: { isCancelledFreeTrial: true } },
    })),
  );
});

Meteor.publish('productUsers.listByProduct', function listByProduct(params) {
  check(params, FilterQuerySchema);

  if (!this.userId) {
    return this.ready();
  }

  const { productId } = params;

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  const query = buildFilterQuery(params);
  const options = {
    sort: { createdAt: -1 },
    skip: params.offset,
    limit: params.limit,
  };

  Counts.publish(
    this,
    'productUsers.listByProduct.count',
    ProductUsers.find(query, options),
    { noReady: true }
  );

  const userIds = _.uniq(ProductUsers.find(query, _.extend({ fields: { userId: 1 } }, options))
    .map(u => u.userId));

  return [
    ProductUsers.find(query, options),
    Plans.find(),
    Meteor.users.find({ _id: { $in: userIds } }, {
      fields: {
        'services.facebook.link': 1,
        emails: 1,
      },
    }),
  ];
});
