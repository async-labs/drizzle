import React, { PropTypes, Component } from 'react';
import { getNotPaidUserMessage } from '../util';

import {
  PaywallLayout,
  PaywallCallToActionButton,
  Button,
  ContentPlaceholder,
  RegisterForm,
  LoginForm,
  RecoverPasswordForm,
} from '/imports/ui/components';

const styles = {
  message: {
    color: '#222222',
    fontSize: '15px',
    opacity: '0.8',
    margin: '20px 0px',
  },
  callToActionButton: {
    marginBottom: '20px',
  },
  loginButtonsContainer: {
    marginBottom: '20px',
    opacity: 0,
  },
  contentPlaceholder: {
    marginTop: 20,
  },
  guestForm: {
    maxWidth: '346px !important',
    margin: '5px auto !important',
    padding: '15px !important',
    backgroundColor: 'white !important',
  },
};

class Paywall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMessage: props.showMessage,
    };

    this.renderPaywallBody = this.renderPaywallBody.bind(this);
  }

  renderPaywallBody() {
    const {
      user,
      product,
      wall,
      content,
      paid,
      purchasedCount,
      widgetConfig,
      subscriptionEnabled,
      userSubscribed,
      showLoginForm,
      showRecoverPasswordForm,
      userStore,
    } = this.props;

    const upvoted = (user && wall.upvotedUserIds &&
      wall.upvotedUserIds.indexOf(user._id) !== -1 || false);

    const wallPrice = (product.paygEnabled && !wall.disableMicropayment
      && wall.price / 100 || undefined);

    // ------------------------
    // Paywall for Paid Users
    // ------------------------
    if (paid) {
      let subscribeButton = null;
      if (subscriptionEnabled && !userSubscribed) {
        subscribeButton = (
          <Button
            className={'zenmarket--subscribe-button'}
            label={'Get unlimited access'}
          />
        );
      }

      // Inject content
      wall.content.original = content;

      return (
        <div>
          {user && !upvoted ?
            <Button
              label={'I recommend'}
              className={'zenmarket--upvote-button'}
              iconRight={
                <i className="fa fa-heart" />
              }
            /> : null}

          {subscribeButton}
        </div>
      );
    }

    // ------------------------
    // Paywall for Guests
    // ------------------------
    if (!user) {
      return (
        <div>
          <PaywallCallToActionButton
            id={'GuestCallToActionButton'}
            product={product}
            widgetConfig={widgetConfig}
            wall={wall}
          />
          {this.state.showMessage && (
            <div style={styles.guestForm}>
              {/* FIX: I know this is too much nesting, will fix soon! :) */}
              {showRecoverPasswordForm ? (
                <RecoverPasswordForm
                  isSubmiting={userStore.isRecoveringPassword}
                />
              ) : showLoginForm ? (
                <LoginForm
                  isSubmiting={userStore.isAuthenticating}
                  fields={{
                    email: userStore.email,
                    password: userStore.password,
                  }}
                />
              ) : (
                <RegisterForm
                  isSubmiting={userStore.isAuthenticating}
                />
              )}
            </div>
          )}
          <ContentPlaceholder style={styles.contentPlaceholder} />
        </div>
      );
    }

    const { freeTrialDayCount, isFreeTrialEnabled } = product;
    const isSubscribedFreeTrial = user.isSubscribedFreeTrial(product._id);


    // -----------------------------
    // Paywall for Not Paid Users
    // -----------------------------
    const message = getNotPaidUserMessage({
      wallPrice,
      subscriptionEnabled,
      freeTrial: !!(isFreeTrialEnabled && freeTrialDayCount && !isSubscribedFreeTrial),
    });

    let trialButton = null;
    const days = freeTrialDayCount > 1 ? 'days' : 'day';
    if (isFreeTrialEnabled && freeTrialDayCount && !isSubscribedFreeTrial) {
      trialButton = (
        <div style={{ width: '100%' }}>
          <Button
            label={`Start ${freeTrialDayCount} ${days} free trial`}
            className={'zenmarket--subscribe-button'}
            style={{ width: '100%', maxWidth: '235px' }}
          />
        </div>
      );
    }

    let subscribeButton = null;
    if (subscriptionEnabled && !trialButton) {
      subscribeButton = (
        <Button
          label="Get unlimited access"
          className={'zenmarket--subscribe-button'}
          style={{ width: '100%', maxWidth: '235px' }}
        />
      );
    }

    let buttons = null;
    if (wall.donationEnabled) {
      buttons = wallPrice ? (
        <Button
          label={`Donate ${wallPrice.toFixed(2)}`}
          className={'zenmarket--pay-button'}
        />
      ) : null;
    } else {
      buttons = (
        <div>
          {wallPrice ? (
            <div style={{ width: '100%' }}>
              <Button
                label={`Pay $${wallPrice.toFixed(2)} to access`}
                className={'zenmarket--pay-button'}
                style={{ width: '100%', maxWidth: '235px' }}
              />
            </div>
          ) : null}

          {trialButton}
          {subscribeButton}
        </div>
      );
    }

    return (
      <div>
        <p style={styles.message}>
          {message}
        </p>
        {purchasedCount >= 10 ?
          <p className="login-cta">
            You paid 10 times on this website.
            Consider saving money via monthly subscription.
          </p>
          : ''}
        {buttons}
        <ContentPlaceholder style={styles.contentPlaceholder} />
      </div>
    );
  }

  render() {
    const { product, wall, socialProof } = this.props;

    return (
      <PaywallLayout
        wall={wall}
        isClientSide={product.isClientSide || false}
        topLeftMessage={socialProof}
      >
        {this.renderPaywallBody()}
      </PaywallLayout>
    );
  }
}

Paywall.defaultProps = {
  purchasedCount: 0,
  showMessage: false,
};

Paywall.propTypes = {
  user: PropTypes.object,
  product: PropTypes.object.isRequired,
  wall: PropTypes.object.isRequired,
  purchasedCount: PropTypes.number,
  content: PropTypes.string,
  socialProof: PropTypes.string,
  paid: PropTypes.bool.isRequired,
  subscriptionEnabled: PropTypes.bool.isRequired,
  widgetConfig: PropTypes.object.isRequired,
  userSubscribed: PropTypes.bool.isRequired,
  charge: PropTypes.object,
  showMessage: PropTypes.bool,
  isSigningUp: PropTypes.bool,

  showLoginForm: PropTypes.bool,
  showRecoverPasswordForm: PropTypes.bool,
  userStore: PropTypes.object,
};

export default Paywall;
