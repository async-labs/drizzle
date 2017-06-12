import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import Plans from '../containers/Plans';
import FreeTrial from '../containers/FreeTrial';
import Annual from '../containers/Annual';
import Monthly from '../containers/Monthly';
import Weekly from '../containers/Weekly';
import DiscountForm from '../containers/DiscountForm';

class Subscription extends Component {
  renderDiscountForm() {
    const {
      hasActiveDiscount,
    } = this.props;

    if (!hasActiveDiscount) { return null; }
    return <DiscountForm />;
  }

  renderMain() {
    const {
      plan,

      currentSubscription,
      trialSubscription,
      isSubscribedFreeTrial,
      freeTrialDayCount,
      isFreeTrialEnabled,
      isPaid,

      annualEnabled,
      monthlyEnabled,
      weeklyEnabled,

      annualSubscribed,
      changeAnnualSubscribed,
      monthlySubscribed,
      changeMonthlySubscribed,
      weeklySubscribed,
      changeWeeklySubscribed,

      annualInProgress,
      changeAnnualInProgress,
      monthlyInProgress,
      changeMonthlyInProgress,
      weeklyInProgress,
      changeWeeklyInProgress,
    } = this.props;

    if ((isFreeTrialEnabled && freeTrialDayCount && !currentSubscription &&
        !isPaid && !isSubscribedFreeTrial) || trialSubscription) {
      return <FreeTrial />;
    }

    let subComp = null;
    if (!trialSubscription) {
      subComp = (
        <div>
          {this.renderDiscountForm()}

          <p> Choose a subscription plan: </p>
          <hr style={{ marginTop: 0 }} />

          {weeklyEnabled && !monthlyInProgress && !annualInProgress ?
            <Weekly
              subscribed={weeklySubscribed}
              changeSubscribed={changeWeeklySubscribed}
              changeInProgress={changeWeeklyInProgress}
            /> : null}

          {monthlyEnabled && !weeklyInProgress && !annualInProgress ?
            <Monthly
              subscribed={monthlySubscribed}
              changeSubscribed={changeMonthlySubscribed}
              changeInProgress={changeMonthlyInProgress}
            /> : null}

          {annualEnabled && !weeklyInProgress && !monthlyInProgress ?
            <Annual
              subscribed={annualSubscribed}
              changeSubscribed={changeAnnualSubscribed}
              changeInProgress={changeAnnualInProgress}
            /> : null}

          {plan && !annualSubscribed && !monthlySubscribed && !weeklySubscribed ? <Plans /> : null}

          <ul className="fs12" style={{ listStyle: 'disc !important', marginTop: '10px' }}>
            {currentSubscription && (annualSubscribed || monthlySubscribed || weeklySubscribed) ?
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
      plan,
      annualEnabled,
      monthlyEnabled,
      weeklyEnabled,
      isOwner,
    } = this.props;

    if (!annualEnabled && !monthlyEnabled && !weeklyEnabled && !plan) {
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
  annualEnabled: PropTypes.bool.isRequired,
  monthlyEnabled: PropTypes.bool.isRequired,
  weeklyEnabled: PropTypes.bool.isRequired,
  plan: PropTypes.object,

  currentSubscription: PropTypes.object,
  trialSubscription: PropTypes.object,
  isSubscribedFreeTrial: PropTypes.bool.isRequired,
  isFreeTrialEnabled: PropTypes.bool,
  isPaid: PropTypes.bool,
  freeTrialDayCount: PropTypes.number,

  hasActiveDiscount: PropTypes.bool,

  annualSubscribed: PropTypes.bool.isRequired,
  changeAnnualSubscribed: PropTypes.func.isRequired,
  monthlySubscribed: PropTypes.bool.isRequired,
  changeMonthlySubscribed: PropTypes.func.isRequired,
  weeklySubscribed: PropTypes.bool.isRequired,
  changeWeeklySubscribed: PropTypes.func.isRequired,

  annualInProgress: PropTypes.bool.isRequired,
  changeAnnualInProgress: PropTypes.func.isRequired,
  monthlyInProgress: PropTypes.bool.isRequired,
  changeMonthlyInProgress: PropTypes.func.isRequired,
  weeklyInProgress: PropTypes.bool.isRequired,
  changeWeeklyInProgress: PropTypes.func.isRequired,
};

export default Subscription;

/* <p> Weekly <Button label={'Subscribe'} style={{ fontSize: 14, padding: '5px 15px', float: 'right' }} /> </p>
<p> Monthly <Button label={'Subscribe'} style={{ fontSize: 14, padding: '5px 15px', float: 'right' }} /> </p> */
