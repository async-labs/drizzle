import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { WidgetSubscriptionPlan, Button } from '/imports/ui/components';
import { subscribeMonthly, unsubscribeMonthly } from '../actions';
import SubscribedMessage from './SubscribedMessage';
import ConfirmationButton from './ConfirmationButton';


class Monthly extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationButtons: false,
    };
  }

  unsubscribe() {
    const { product, wall, changeSubscribed } = this.props;

    this.toggleConfirmationButton();
    changeSubscribed(false);

    unsubscribeMonthly({
      productId: product._id,
      wallId: wall && wall._id,
    }, (err) => {
      if (err) {
        changeSubscribed(true);
      }
    });
  }

  subscribe() {
    const { product, wall, changeSubscribed } = this.props;

    this.toggleConfirmationButton();
    changeSubscribed(true);

    subscribeMonthly({
      productId: product._id,
      wallId: wall && wall._id,
    }, (err) => {
      if (err) {
        changeSubscribed(false);
      }
    });
  }

  toggleConfirmationButton() {
    const { subscribed, changeInProgress } = this.props;
    if (!subscribed) {
      changeInProgress(!this.state.showConfirmationButtons);
    }

    this.setState({
      showConfirmationButtons: !this.state.showConfirmationButtons,
    });
  }

  renderButton() {
    const {
      price,
      subscribed,
      product,
    } = this.props;

    if (subscribed) {
      return (
        <div style={{ textAlign: 'center' }}>
          <SubscribedMessage
            message={
              `You are subscribed to Monthly plan for $${(price / 100).toFixed(2)}/month at ${product.domain}`
            }
          />

          {this.state.showConfirmationButtons ? (
            <div>
              <div style={{ fontSize: 14, textAlign: 'center', margin: 10 }}>
                Are you sure you want to cancel your monthly subscription?
              </div>
              <ConfirmationButton
                onClickConfirm={::this.unsubscribe}
                onClickCancel={::this.toggleConfirmationButton}
              />
            </div>

          ) : (
            <Button
              onClick={::this.toggleConfirmationButton}
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
              Please confirm to start your monthly subscription.
            </div>
            <ConfirmationButton
              onClickConfirm={::this.subscribe}
              onClickCancel={::this.toggleConfirmationButton}
            />
          </div>

        ) : (
          <WidgetSubscriptionPlan
            name={'Month'}
            price={price}
            onSubscribeButtonClick={::this.toggleConfirmationButton}
          />
        )}
      </div>
    );
  }

  renderCancelledSubscriptionMessage() {
    const { monthlySubscription, subscribed } = this.props;

    if (!subscribed && monthlySubscription) {
      return (
        <p className="margin-5" style={{ fontSize: '12px', color: 'red' }}>
          You're unsubscribed now.<br />
          You have access till {moment(monthlySubscription.endAt).format('DD MMM YYYY')}.
          <br />
          You can subscribe back at any time.
        </p>
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderButton()}

        {this.renderCancelledSubscriptionMessage()}
      </div>
    );
  }
}

Monthly.propTypes = {
  product: PropTypes.object.isRequired,
  wall: PropTypes.object,
  user: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  monthlySubscription: PropTypes.object,

  subscribed: PropTypes.bool.isRequired,
  changeSubscribed: PropTypes.func.isRequired,
  changeInProgress: PropTypes.func.isRequired,
};

export default Monthly;
