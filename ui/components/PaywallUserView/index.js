import React, { PropTypes } from 'react';
import Button from '../Button';
import PaywallLayout from '../PaywallLayout';
import PaywallCallToActionButton from '../PaywallCallToActionButton';

const styles = {
  callToActionButton: {
    marginBottom: '20px',
  },
  loginMessage: {
    color: '#222222',
    fontSize: '15px',
    opacity: '0.8',
    padding: '10px 0px',
  },
  loginButton: {
    margin: '10px',
  },
  loginButtonsContainer: {
    marginBottom: '20px',
    opacity: 0,
  },
  videoImg: {
    width: '100%',
  },
};

const Messages = {
  leadGeneration: `By clicking the below button, you agree to share
your user information on Drizzle with this website.`,
};

const PaywallUserView = ({
  product,
  wall,
  widgetConfig,
  remainingFreeCount,
  onCallToActionButtonClick,
}) => (
  <PaywallLayout
    upvotedCount={wall.upvotedCount}
    remainingFreeCount={remainingFreeCount}
    disableMeteredPaywall={wall.disableMeteredPaywall}
  >
    <PaywallCallToActionButton
      id={'UserCallToActionButton'}
      className={'zenmarket--generate-lead-button'}
      product={product}
      widgetConfig={widgetConfig}
      wall={wall}
      style={styles.callToActionButton}
      onClick={onCallToActionButtonClick}
    />

    {wall.leadGeneration ? (
      <p> {Messages.leadGeneration} </p>
    ) : null}

  </PaywallLayout>
);

PaywallUserView.defaultProps = {
  showLoginButtons: false,
  widgetConfig: {},
};

PaywallUserView.propTypes = {
  product: PropTypes.object.isRequired,
  wall: PropTypes.object.isRequired,

  remainingFreeCount: PropTypes.number,
  widgetConfig: PropTypes.object.isRequired,
  showLoginButtons: PropTypes.bool.isRequired,
  onCallToActionButtonClick: PropTypes.func,
};

export default PaywallUserView;
