import React, { PropTypes, Component } from 'react';
import { getNotPaidUserMessage } from '../util';
import PromoCode from '/imports/users/client/components/PromoCode';

import {
  PaywallLayout,
  PaywallCallToActionButton,
  Button,
  ContentPlaceholder,
  PaywallVideoThumbnail,
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
      unlockedCount,
      content,
      paid,
      purchasedCount,
      alreadySaved,
      widgetConfig,
      disableMeteredPaywall,
      subscriptionEnabled,
      userSubscribed,
      showPromoCodeForm,
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

          {user && !alreadySaved ?
            <Button
              label={'Read later'}
              className={'zenmarket--read-later'}
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
              ) : showPromoCodeForm ? (
                <PromoCode promoCode={userStore.promoCode} />
              ) : (
                <RegisterForm
                  showPromoCodeLink={product.isReferralEnabled()}
                  promoCode={userStore.promoCode}
                  isSubmiting={userStore.isAuthenticating}
                />
              )}
            </div>
          )}
          {wall.isVideo
            ? <PaywallVideoThumbnail wall={wall} />
            : <ContentPlaceholder style={styles.contentPlaceholder} />}
        </div>
      );
    }

    // -----------------------------
    // Paywall for Lead Generation
    // -----------------------------
    if (wall.leadGeneration) {
      return (
        <div>
          <p style={styles.message}> By clicking the button bellow, you agree to share your user information on Drizzle with this website. </p>
          <PaywallCallToActionButton
            wall={wall}
            product={product}
            className={'zenmarket--generate-lead-button'}
            widgetConfig={widgetConfig}
          />
          {wall.isVideo
            ? <PaywallVideoThumbnail wall={wall} />
            : <ContentPlaceholder style={styles.contentPlaceholder} />}
        </div>
      );
    }

    // -----------------------------
    // Paywall for Metered Paywall
    // -----------------------------
    if (!disableMeteredPaywall && product.freeArticleCount &&
        (!unlockedCount || product.freeArticleCount > unlockedCount)) {
      return (
        <div>
          <PaywallCallToActionButton
            wall={wall}
            product={product}
            label={'Yes, unlock for free'}
            className={'zenmarket--unlock-button'}
            widgetConfig={widgetConfig}
          />
          {wall.isVideo
            ? <PaywallVideoThumbnail wall={wall} />
            : <ContentPlaceholder style={styles.contentPlaceholder} />}
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
      dailyAccess: product.isDailyAccessEnabled(),
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

    let dailyAccessButton = null;
    if (product.isDailyAccessEnabled()) {
      const { dailyAccessConfig: { price } } = product;

      dailyAccessButton = (
        <div style={{ width: '100%' }}>
          <Button
            label={`Buy daily pass for $${(price / 100).toFixed(2)}`}
            className={'zenmarket--day-access-button'}
            style={{ width: '100%', maxWidth: '235px', marginBottom: '10px' }}
          />
        </div>
      );
    }

    let singlePaymentPlanButton = null;
    const singlePaymentPlan = wall.getSinglePaymentPlan();
    if (singlePaymentPlan) {
      const price = singlePaymentPlan.price / 100;

      singlePaymentPlanButton = (
        <div style={{ width: '100%' }}>
          <Button
            label={`Buy access to "${singlePaymentPlan.name}" for $${price.toFixed(2)}`}
            className={'zenmarket--buy-plan-button'}
            style={{ width: '100%', maxWidth: '235px', marginBottom: '10px' }}
          />
        </div>
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

          {singlePaymentPlanButton}
          {dailyAccessButton}

          {!alreadySaved ?
            <Button
              label={'Read later'}
              className={'zenmarket--read-later'}
            /> : null}

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
        {wall.isVideo
          ? <PaywallVideoThumbnail wall={wall} />
          : <ContentPlaceholder style={styles.contentPlaceholder} />}
      </div>
    );
  }

  render() {
    const { product, wall, unlockedCount, socialProof } = this.props;
    const remainingFreeCount = product.freeArticleCount - (unlockedCount || 0);

    return (
      <PaywallLayout
        wall={wall}
        isClientSide={product.isClientSide || false}
        isMeteredPaywall={wall.isMeteredPaywall()}
        remainingFreeCount={remainingFreeCount}
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
  unlockedCount: PropTypes.number,
  purchasedCount: PropTypes.number,
  content: PropTypes.string,
  socialProof: PropTypes.string,
  paid: PropTypes.bool.isRequired,
  subscriptionEnabled: PropTypes.bool.isRequired,
  widgetConfig: PropTypes.object.isRequired,
  alreadySaved: PropTypes.bool.isRequired,
  disableMeteredPaywall: PropTypes.bool.isRequired,
  userSubscribed: PropTypes.bool.isRequired,
  charge: PropTypes.object,
  showMessage: PropTypes.bool,
  isSigningUp: PropTypes.bool,

  showPromoCodeForm: PropTypes.bool,
  showLoginForm: PropTypes.bool,
  showRecoverPasswordForm: PropTypes.bool,
  userStore: PropTypes.object,
};

export default Paywall;
