import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { getCurrentProduct } from '/imports/products/client/api';
import ReferralMessage from '../components/ReferralMessage';

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();

  const productUser = user.getProductUser(product._id);
  const referral = productUser.getPendingReferral();

  const message = referral.getNoticeMessage();

  onData(null, {
    onClaimButtonClick() {
      if (referral.condition === 'buyMonthlySubscription') {
        FlowRouter.go('/');
      } else if (referral.condition === 'addCardInfo') {
        FlowRouter.go('/card-info');
      }
    },
    message,
  });
}

export default composeWithTracker(composer)(ReferralMessage);
