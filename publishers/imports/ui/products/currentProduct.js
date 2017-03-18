import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import { Products } from 'meteor/drizzle:models';

const productId = new ReactiveVar(null);

export function changeProduct({ id }) {
  productId.set(id);
}

export function currentProduct() {
  if (!Meteor.user()) {
    return null;
  }

  const filter = { _id: productId.get() };
  if (!Meteor.user().isAdmin()) {
    filter.vendorUserId = Meteor.userId();
  }

  return Products.findOne(filter);
}
