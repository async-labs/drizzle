import React, { PropTypes } from 'react';
import Button from '../Button';

export const callToActionText = (product, wall) => {
  if (wall.donationEnabled) {
    const wallPrice = (
      product.paygEnabled &&
      !wall.disableMicropayment &&
      wall.price / 100 || undefined
    );

    return wall.donationMessage
    ? `${wall.donationMessage}${wallPrice && ` $${wallPrice.toFixed(2)}` || ''}`
    : `Donate${wallPrice && ` $${wallPrice.toFixed(2)}` || ''}`;
  }

  return wall.guestButtonText || 'Read more';
};

const PaywallCallToActionButton = ({ label, product, wall, style, ...props }) => (
  <Button
    label={label || callToActionText(product, wall)}
    iconRight={
      <img
        src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png"
        alt="Drizzle"
      />
    }
    style={style}
    {...props}
  />
);

PaywallCallToActionButton.propTypes = {
  label: PropTypes.string,
  product: PropTypes.shape({
    paygEnabled: PropTypes.bool,
  }).isRequired,
  wall: PropTypes.shape({
    donationEnabled: PropTypes.bool,
    disableMicropayment: PropTypes.bool,
    price: PropTypes.number,
  }).isRequired,
  style: PropTypes.object,
};

export default PaywallCallToActionButton;
