import React, { PropTypes } from 'react';

const styles = {
  root: {
    backgroundColor: 'black',
    backgroundImage: 'url(https://stripe.com/img/documentation/mobile/apple-pay/apple_pay_logo_black.png)',
    backgroundSize: 'auto 44px',
    backgroundPosition: 'center',
    backgroundOrigin: 'content-box',
    backgroundRepeat: 'no-repeat',
    width: '320px',
    height: '44px',
    padding: '10px 0',
    borderRadius: '10px',
    border: 'none',
  },
  disabled: {
    opacity: '0.3',
    cursor: 'not-allowed',
  },
};

const ApplePayButton = ({ onClick, disabled, style }) => {
  const mergedStyles = Object.assign({},
    styles.root,
    disabled && styles.disabled,
    style
  );

  return (
    <button
      id="apple-bay-button"
      style={mergedStyles}
      onClick={onClick}
      disabled={disabled}
    > </button>
  );
};

ApplePayButton.propTyoes = {
  disabled: false,
};

ApplePayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default ApplePayButton;
