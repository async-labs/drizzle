import React, { PropTypes } from 'react';
import moment from 'moment';

import { WidgetSubscriptionPlan, Button } from '/imports/ui/components';
import ConfirmationButton from './ConfirmationButton';
import SubscribedMessage from './SubscribedMessage';
import { toggleSubscribe } from '../actions';


export default React.createClass({
  propTypes: {
    product: PropTypes.object.isRequired,
    wall: PropTypes.object.isRequired,
    planSubscription: PropTypes.object,
    plan: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      showConfirmationButtons: false,
    };
  },

  unsubscribe() {
    const { product, plan, wall } = this.props;

    this.toggleConfirmationButton();
    toggleSubscribe({
      productId: product._id,
      wallId: wall._id,
      planId: plan._id,
      subscribe: false,
    });

    return true;
  },

  subscribe() {
    const { product, plan, wall } = this.props;

    this.toggleConfirmationButton();

    toggleSubscribe({
      productId: product._id,
      wallId: wall._id,
      planId: plan._id,
      subscribe: true,
    });

    return true;
  },

  toggleConfirmationButton() {
    this.setState({
      showConfirmationButtons: !this.state.showConfirmationButtons,
    });
  },

  renderButton(plan) {
    const {
      user,
      product,
    } = this.props;

    const subscribed = user.subscribedPlans && user.subscribedPlans.indexOf(plan._id) !== -1;

    if (subscribed) {
      return (
        <div style={{ textAlign: 'center' }}>
          <SubscribedMessage
            message={
              `You are subscribed to "${plan.name}" category only plan for
              $${(plan.price / 100).toFixed(2)}/${plan.getPeriodString()} at ${product.domain}`
            }
          />

          {this.state.showConfirmationButtons ? (
            <div>
              <div style={{ fontSize: 14, textAlign: 'center', margin: 10 }}>
                Are you sure you want to cancel your "${plan.name}" category subscription?
              </div>
              <ConfirmationButton
                onClickConfirm={this.unsubscribe}
                onClickCancel={this.toggleConfirmationButton}
              />
            </div>

          ) : (
            <Button
              onClick={this.toggleConfirmationButton}
              btnSize={'small'}
              label={'Cancel subscription'}
              fullWidth
            />
          )}
        </div>
      );
    }

    return (
      <div>
        {this.state.showConfirmationButtons ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, textAlign: 'center', margin: 10 }}>
              Please confirm to start your "{plan.name}" category only subscription.
            </div>
            <ConfirmationButton
              onClickConfirm={this.subscribe}
              onClickCancel={this.toggleConfirmationButton}
            />
          </div>

        ) : (
          <WidgetSubscriptionPlan
            name={plan.getPeriodString()}
            price={plan.price}
            onSubscribeButtonClick={this.toggleConfirmationButton}
          />
        )}
      </div>
    );
  },

  renderToggle(plan) {
    const { planSubscription, user } = this.props;
    const subscribed = user.subscribedPlans && user.subscribedPlans.indexOf(plan._id) !== -1;

    return (
      <div>
        {this.renderButton(plan)}

        {!subscribed && planSubscription ?
          <p className="margin-5" style={{ fontSize: '12px', color: 'red' }}>
            You're unsubscribed now.<br />
            You have access till {moment(planSubscription.endAt).format('DD MMM YYYY')}.
            <br />
            You can subscribe back at any time.
          </p> : null}
      </div>
    );
  },

  render() {
    const { plan } = this.props;

    if (!plan) {
      return null;
    }

    return (
      <div>
        <hr style={{ marginBottom: '10px' }} />
        <p>Subscribe to access content in "{plan.name}" category only</p>
        {this.renderToggle(plan)}
      </div>
    );
  },
});
