import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { getCurrentProduct } from '/imports/products/client/api';
import { error, success } from '/imports/notifier';

import {
  Subscriptions,
} from 'meteor/drizzle:models';

import DiscountForm from '../components/DiscountForm';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();

  if (!user || !product) {
    return;
  }

  const productUser = user.getProductUser(product._id);
  const { discountConfig } = product;
  const isAppliedDiscount = !!(productUser && discountConfig &&
    discountConfig.promoCode === productUser.usedDiscountCode);

  const now = new Date();
  const currentSubscription = Subscriptions.findOne({
    userId: user._id, productId: product._id,
    isFreeTrial: { $exists: false },
    beginAt: { $lte: now }, endAt: { $gte: now },
  });

  const data = {
    isAppliedDiscount,
    currentSubscription,
    discountConfig,
    onSubmit(event) {
      event.preventDefault();
      const discountCode = event.target.discountCode.value;

      if (!discountCode) {
        error('Input discount code');
        return;
      }

      Meteor.call('subscriptions.saveDiscount', { productId: product._id, discountCode }, err => {
        if (err) {
          error(err);
          return;
        }

        success('Discount applied');
      });
    },
  };

  onData(null, data);
}

export default composeWithTracker(composer)(DiscountForm);
