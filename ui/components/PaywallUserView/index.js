import React, { PropTypes } from 'react';
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
};

const PaywallUserView = ({
  product,
  wall,
  widgetConfig,
  onCallToActionButtonClick,
}) => (
  <PaywallLayout
    upvotedCount={wall.upvotedCount}
  >
    <PaywallCallToActionButton
      id={'UserCallToActionButton'}
      product={product}
      widgetConfig={widgetConfig}
      wall={wall}
      style={styles.callToActionButton}
      onClick={onCallToActionButtonClick}
    />
  </PaywallLayout>
);

PaywallUserView.defaultProps = {
  showLoginButtons: false,
  widgetConfig: {},
};

PaywallUserView.propTypes = {
  product: PropTypes.object.isRequired,
  wall: PropTypes.object.isRequired,

  widgetConfig: PropTypes.object.isRequired,
  showLoginButtons: PropTypes.bool.isRequired,
  onCallToActionButtonClick: PropTypes.func,
};

export default PaywallUserView;
