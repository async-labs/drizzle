import { Meteor } from 'meteor/meteor';

import { getCurrentProduct } from '/imports/products/client/api';

import { ProductUsers } from 'meteor/drizzle:models';

export function getFreeReadArticleCount() {
  const userId = Meteor.userId();
  const product = getCurrentProduct();

  if (!userId || !product) { return undefined; }

  const productUser = ProductUsers.findOne({ userId, productId: product._id });

  if (!productUser) { return 0; }

  const now = new Date();
  const currentDate = now.getFullYear() * 100 + now.getMonth();

  if (productUser.freeQuotaTrackingDate !== currentDate) {
    return 0;
  }

  return productUser.freeReadArticleCount;
}
