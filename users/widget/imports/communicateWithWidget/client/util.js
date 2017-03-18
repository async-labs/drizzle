import React from 'react';

/**
 * Break the message from getMessage if has <br /> tag in multiple lines to render.
 */
export const breakLine = (text) => {
  const regex = /(<br \/>)/g;
  return text.split(regex).map(line =>
    line.match(regex) ? React.createElement('br') : line);
};

export const getNotPaidUserMessage = ({
  wallPrice,
  subscriptionEnabled,
  freeTrial,
}) => {
  if (!wallPrice && freeTrial) {
    return 'Start your free trial today.';
  }

  if (wallPrice && freeTrial) {
    return `Start your free trial today or pay-per-content $${wallPrice.toFixed(2)}`;
  }

  if (wallPrice && !subscriptionEnabled) {
    return `Pay $${wallPrice.toFixed(2)} for hidden content below.`;
  }

  if (!wallPrice && subscriptionEnabled) {
    return 'Buy unlimited access';
  }

  if (wallPrice && subscriptionEnabled) {
    return `Pay-per-content $${wallPrice.toFixed(2)} or buy unlimited access.`;
  }

  if (wallPrice && !subscriptionEnabled) {
    return `Pay-per-content $${wallPrice.toFixed(2)}`;
  }

  if (!wallPrice && subscriptionEnabled) {
    return 'Buy unlimited access';
  }

  if (wallPrice && subscriptionEnabled) {
    return `Pay-per-content $${wallPrice.toFixed(2)} or buy unlimited access`;
  }

  return '';
};


export const getUserGuestMessage = ({ wall, widgetConfig }) => {
  if (widgetConfig && widgetConfig.loginMessageRegular) {
    return widgetConfig.loginMessageRegular;
  }

  if (wall) {
    if (wall.donationEnabled) {
      return 'Log in to make a donation.';
    }
  }

  return 'Log in to access premium content.';
};
