import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { WidgetSubscriptionPlan, Button } from '/imports/ui/components';
import SubscribedMessage from './SubscribedMessage';
import { toggleSubscribe } from '../actions';
import ConfirmationButton from './ConfirmationButton';

class Weekly extends Component {
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

    toggleSubscribe({
      productId: product._id,
      weekly: true,
      subscribe: false,
      wallId: wall && wall._id,
    }, err => {
      if (err) {
        changeSubscribed(true);
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

  subscribe() {
    const { product, wall, changeSubscribed } = this.props;

    this.toggleConfirmationButton();
    changeSubscribed(true);

    toggleSubscribe({
      productId: product._id,
      weekly: true,
      subscribe: true,
      wallId: wall && wall._id,
    }, err => {
      if (err) {
        changeSubscribed(false);
      }
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
            message={`You are subscribed to Weekly plan for $${(price / 100).toFixed(2)}/week at ${product.domain}`}
          />

          {this.state.showConfirmationButtons ? (
            <div>
              <div style={{ fontSize: 14, textAlign: 'center', margin: 10 }}>
                  Are you sure you want to cancel your weekly subscription?
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
              Please confirm to start your weekly subscription.
            </div>
            <ConfirmationButton
              onClickConfirm={::this.subscribe}
              onClickCancel={::this.toggleConfirmationButton}
            />
          </div>

        ) : (
          <WidgetSubscriptionPlan
            name={'Week'}
            price={price}
            onSubscribeButtonClick={::this.toggleConfirmationButton}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      weeklySubscription,
      subscribed,
    } = this.props;

    return (
      <div>
        {this.renderButton()}

        {!subscribed && weeklySubscription && (
          <p className="margin-5" style={{ fontSize: '12px', color: 'red' }}>
            You're unsubscribed now.<br />
            You have access till {moment(weeklySubscription.endAt).format('DD MMM YYYY')}.
            <br />
            You can subscribe back at any time.
          </p>
        )}
      </div>
    );
  }
}

Weekly.propTypes = {
  product: PropTypes.object.isRequired,
  wall: PropTypes.object,
  price: PropTypes.number.isRequired,
  weeklySubscription: PropTypes.object,

  subscribed: PropTypes.bool.isRequired,
  changeSubscribed: PropTypes.func.isRequired,
  changeInProgress: PropTypes.func.isRequired,
};

export default Weekly;
