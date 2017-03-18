import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import FreeTrial from '../containers/FreeTrial';
import Monthly from '../containers/Monthly';

class Subscription extends Component {

  renderMain() {
    const {
      currentSubscription,
      trialSubscription,
      isSubscribedFreeTrial,
      freeTrialDayCount,
      isFreeTrialEnabled,
      isPaid,

      monthlyEnabled,

      monthlySubscribed,
      changeMonthlySubscribed,

      changeMonthlyInProgress,
    } = this.props;

    if ((isFreeTrialEnabled && freeTrialDayCount && !currentSubscription &&
        !isPaid && !isSubscribedFreeTrial) || trialSubscription) {
      return <FreeTrial />;
    }

    let subComp = null;
    if (!trialSubscription) {
      subComp = (
        <div>
          <p> Choose a subscription plan: </p>
          <hr style={{ marginTop: 0 }} />

          {monthlyEnabled ?
            <Monthly
              subscribed={monthlySubscribed}
              changeSubscribed={changeMonthlySubscribed}
              changeInProgress={changeMonthlyInProgress}
            /> : null}

          <ul className="fs12" style={{ listStyle: 'disc !important', marginTop: '10px' }}>
            {currentSubscription && monthlySubscribed ?
              <li>
                Your next payment is on {moment(currentSubscription.endAt).add(1, 'day').format('MMM DD YYYY')}.
              </li> : null}
            <li>
              Platform fee of 4% will be added to your bill.
            </li>
          </ul>
        </div>
      );
    }

    return subComp;
  }

  render() {
    const {
      product,
      monthlyEnabled,
      isOwner,
    } = this.props;

    if (!monthlyEnabled) {
      return (
        <div>
          <p className="margin-10">Available subscriptions for {product.domain}</p>
          <div className="card fs12">
            Subscription option <b>is not enabled</b> by the website owner.
          </div>
        </div>
      );
    }

    if (isOwner) {
      return (
        <div>
          <p className="margin-10">Available subscriptions for {product.domain}</p>
          <div className="card fs12">
            Subscription option <b>is not enabled</b> by the website owner.
            <p><b>You are the owner</b>: <a href="https://app.getdrizzle.com" target="_blank">Dashboard</a></p>
          </div>
        </div>
      );
    }

    return this.renderMain();
  }
}

Subscription.propTypes = {
  product: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  monthlyEnabled: PropTypes.bool.isRequired,

  currentSubscription: PropTypes.object,
  trialSubscription: PropTypes.object,
  isSubscribedFreeTrial: PropTypes.bool.isRequired,
  isFreeTrialEnabled: PropTypes.bool,
  isPaid: PropTypes.bool,
  freeTrialDayCount: PropTypes.number,

  monthlySubscribed: PropTypes.bool.isRequired,
  changeMonthlySubscribed: PropTypes.func.isRequired,

  changeMonthlyInProgress: PropTypes.func.isRequired,
};

export default Subscription;
