import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Products, Subscriptions } from 'meteor/drizzle:models';

Meteor.publishComposite('subscriptions/listByProduct', function listByProduct(params) {
  check(params, {
    offset: Number,
    limit: Number,
    productId: String,
  });

  if (!this.userId) {
    return { find() { this.ready(); } };
  }

  const { productId } = params;
  const filter = { productId };

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  const options = {
    sort: { createdAt: -1 },
    skip: params.offset,
    limit: params.limit,
  };

  return {
    find() {
      return Subscriptions.find(filter, options);
    },

    children: [{
      find(sub) {
        return Meteor.users.find(sub.userId, { fields: { profile: 1 } });
      },
    }],
  };
});
