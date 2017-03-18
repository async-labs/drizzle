import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Button, WidgetSubscriptionPlan } from '/imports/ui/components';
import SubscribedMessage from './SubscribedMessage';
import ConfirmationButton from './ConfirmationButton';


const styles = {
  footerText: {
    fontSize: '0.8em',
  },
  button: {
    width: '100%',
  },
};

class FreeTrial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationButtons: false,
    };
  }

  subscribe() {
    const {
      subscribeFreetrial,
      product,
      wall,
    } = this.props;

    subscribeFreetrial({
      productId: product._id,
      wallId: wall && wall._id,
    });
  }

  toggleConfirmationButton() {
    this.setState({
      showConfirmationButtons: !this.state.showConfirmationButtons,
    });
  }

  unsubscribe() {
    const {
      unsubscribeFreetrial,
      product,
      wall,
    } = this.props;

    unsubscribeFreetrial({
      productId: product._id,
      wallId: wall && wall._id,
    });

    this.toggleConfirmationButton();
  }

  renderSubscribeButton() {
    const {
      freeTrialDayCount,
      isSubscribedFreeTrial,
      monthlyPrice,
    } = this.props;

    if (isSubscribedFreeTrial) {
      return null;
    }

    const days = freeTrialDayCount > 1 ? 'days' : 'day';
    return (
      <div>
        <WidgetSubscriptionPlan
          name={`Get free access for ${freeTrialDayCount} ${days}`}
          onSubscribeButtonClick={::this.subscribe}
        />
        <ul className="fs12" style={{ listStyle: 'disc !important' }}>
          <li>
            Monthly subscription fee
            {monthlyPrice ? ` ($${(monthlyPrice / 100).toFixed(2)}/mo)` : null},
            will be billed at the end of your free trial period,
            unless free trial is cancelled. Cancel anytime.
          </li>
        </ul>
      </div>
    );
  }


  renderUnsubscribeButton() {
    return (
      <div style={{ textAlign: 'center' }}>
        <SubscribedMessage message={'You are subscribed to Free Trial!'} />

        {this.state.showConfirmationButtons ? (
          <div>
            <div style={{ margin: 10, fontSize: 14 }}>
              Are you sure? You can not do free trial again.
            </div>
            <ConfirmationButton
              onClickConfirm={::this.unsubscribe}
              onClickCancel={::this.toggleConfirmationButton}
            />
          </div>

        ) : (
          <Button
            onClick={::this.toggleConfirmationButton}
            label="Cancel free trial"
            btnSize={'small'}
            fullWidth
          />
        )}
      </div>
    );
  }

  renderFooter() {
    const {
      trialSubscription,
      monthlyPrice,
    } = this.props;

    if (!trialSubscription) {
      return null;
    }

    return (
      <div style={styles.footerText}>
        <ul className="fs12" style={{ listStyle: 'disc !important' }}>
          <li>
            Your free trial ends on {moment(trialSubscription.endAt).format('DD MMM YYYY')}.
          </li>
          <li>
            After that you will be subscribed to monthly plan
            {monthlyPrice ? ` ($${(monthlyPrice / 100).toFixed(2)}/mo)` : null},
            unless you cancel free trial by {moment(trialSubscription.endAt).format('DD MMM YYYY')}.
          </li>
          <li>
            Payments are non-refundable.
          </li>
        </ul>
      </div>
    );
  }

  render() {
    const {
      freeTrialDayCount,
      trialSubscription,
      isFreeTrialEnabled,
    } = this.props;

    if ((!freeTrialDayCount || !isFreeTrialEnabled) && !trialSubscription) {
      return null;
    }

    return (
      <div>
        <p> Choose a subscription plan: </p>
        <hr style={{ marginTop: 0 }} />

        {trialSubscription
          ? this.renderUnsubscribeButton()
          : this.renderSubscribeButton()
        }

        {this.renderFooter()}
      </div>
    );
  }
}

FreeTrial.propTypes = {
  subscribeFreetrial: PropTypes.func.isRequired,
  unsubscribeFreetrial: PropTypes.func.isRequired,

  monthlyPrice: PropTypes.number,
  freeTrialDayCount: PropTypes.number,
  isFreeTrialEnabled: PropTypes.bool,
  product: PropTypes.object.isRequired,
  wall: PropTypes.object,

  trialSubscription: PropTypes.object,
  currentSubscription: PropTypes.object,
  isSubscribedFreeTrial: PropTypes.bool.isRequired,
};

export default FreeTrial;
