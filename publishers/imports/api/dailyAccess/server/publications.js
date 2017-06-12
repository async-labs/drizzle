import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Products, DailyAccessCharges, ProductUsers } from 'meteor/drizzle:models';

Meteor.publishComposite('dailyAccessCharges', function contentWallCharges(params) {
  check(params, {
    productId: String,
    limit: Number,
    offset: Number,
    datePeriod: {
      beginDate: Date,
      endDate: Date,
    },
  });

  const { productId, datePeriod, limit, offset } = params;

  if (!this.userId) {
    return { find() { this.ready(); } };
  }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  return {
    find() {
      return DailyAccessCharges.find({
        productId,
        createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
        amount: { $gt: 0 },
      }, {
        sort: { createdAt: -1 },
        skip: offset,
        limit,
      });
    },

    children: [{
      find(sub) {
        return ProductUsers.find({ userId: sub.userId, productId });
      },
    }],
  };
});
