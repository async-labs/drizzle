import WidgetTabs from '/imports/ui/components/WidgetTabs';

import { ActiveRoute } from 'meteor/zimme:active-route';
import React, { PropTypes } from 'react';
import { composeWithTracker } from 'react-komposer';
import ReactTooltip from 'react-tooltip';

import { Meteor } from 'meteor/meteor';

import { getCurrentProduct } from '/imports/products/client/api';
import { ProductUsers } from 'meteor/drizzle:models';
import VerifyEmail from '/imports/users/client/containers/VerifyEmail';

const UserHeader = ({
  product,
  user,
  isCardDeclined,
  hasFreeAccess,
}) => {
  const tabs = [{
    path: '/wallet',
    label: 'Wallet',
    faIcon: 'fa-money',
    isActive: ActiveRoute.name('wallet'),
  }, {
    path: '/',
    label: 'Subscribe',
    faIcon: 'fa-refresh',
    isActive: ActiveRoute.name('subscription'),
  }, {
    path: '/history',
    label: 'History',
    faIcon: 'fa-file-text-o',
    isActive: ActiveRoute.name('history'),
  }, {
    path: '/card-info',
    label: 'Card info',
    faIcon: 'fa-credit-card',
    isActive: ActiveRoute.name('card-info'),
  }];

  if (!product.paygEnabled) {
    tabs.splice(2, 1);
    tabs.splice(0, 1);
  }

  return (
    <div>
      {!user.isEmailVerified() ? <VerifyEmail /> : null}

      {isCardDeclined ?
        <div
          className="card text-center"
        >
          <a
            href="/card-info"
            style={{ fontSize: '13px', color: 'red' }}
          >
            Card is declined. Please update card info
          </a>
        </div>
        : null}

      {hasFreeAccess ?
        <p
          className="text-center margin-t-10 card"
          style={{
            fontSize: '15px',
            backgroundColor: 'rgba(240, 173, 78, 0.11)',
          }}
        >
          You access content for free!
        </p>
        : null}

      <WidgetTabs tabs={tabs} />
      <ReactTooltip />
    </div>
  );
};

UserHeader.propTypes = {
  product: PropTypes.object,
  amount: PropTypes.number.isRequired,
  walletBalance: PropTypes.number.isRequired,
  depositBalance: PropTypes.number.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isCardDeclined: PropTypes.bool.isRequired,
  hasFreeAccess: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

function headerComposer(props, onData) {
  const user = Meteor.user();

  if (!user) {
    return;
  }

  let amount = 0;
  const product = getCurrentProduct();
  const walletBalance = -(user.walletBalance || 0);
  const depositBalance = user.depositBalance || 0;

  if (!product) {
    return;
  }

  const isOwner = user._id === product.vendorUserId;

  const site = ProductUsers.findOne({ userId: user._id, productId: product._id });
  if (site) {
    amount = site.totalSpent || 0;
  }

  const productUser = user.getProductUser(product._id);
  const hasFreeAccess = !!(productUser && productUser.hasFreeAccess);

  onData(null, {
    product,
    amount,
    walletBalance,
    depositBalance,
    isOwner,
    user,
    hasFreeAccess,
    isCardDeclined: !!user.isCardDeclined,
  });
}

const Loading = () => (<div></div>);
export default composeWithTracker(headerComposer, Loading)(UserHeader);
