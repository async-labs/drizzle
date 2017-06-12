import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { Referrals } from 'meteor/drizzle:models';
import { error } from '/imports/notifier';
import paginated from '/imports/ui/enhancers/Paginated';

import Referral from '../components/Referral.js';
import { getCurrentProduct } from '/imports/products/client/api';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();

  if (!user || !product) {
    return;
  }

  const { offset, limit } = props;

  const sub = Meteor.subscribe('referrals.getEarnedList', {
    offset,
    limit,
    productId: product._id,
  });

  if (!sub.ready()) {
    return;
  }

  const productUser = user.getProductUser(product._id);

  const promoCode = productUser && productUser.promoCode;
  const referralEarning = productUser && productUser.referralEarning || {};

  const data = {
    hasCardInfo: user.hasCardInfo(),
    product,
    referralEarning,
    referrals: Referrals.find({
      earningUserId: user._id,
      isEarned: true,
      productId: product._id,
    }, { limit }).fetch(),
    offset,
    limit,
  };

  if (promoCode) {
    data.promoCode = promoCode;
  } else {
    if (user.hasCardInfo()) {
      Meteor.call('referral.generatePromoCode', { productId: product._id }, (err, code) => {
        if (err) {
          error(err);
        } else {
          data.promoCode = code;
          onData(null, data);
        }
      });
    }
  }

  onData(null, data);
}

export default paginated(composeWithTracker(composer)(Referral));
