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
  dailyAccess,
}) => {
  if (dailyAccess && freeTrial) {
    return 'Buy a daily pass. Or start your free trial today.';
  }

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
    return 'Buy unlimited access. Click button to see all plans.';
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


export const getUserGuestMessage = ({ product, wall, widgetConfig }) => {
  if (widgetConfig && widgetConfig.loginMessageRegular) {
    return widgetConfig.loginMessageRegular;
  }

  if (wall) {
    if (wall.donationEnabled) {
      return 'Log in to make a donation.';
    }
    if (wall.leadGeneration) {
      if (widgetConfig && widgetConfig.loginMessageLeadGeneration) {
        return widgetConfig.loginMessageLeadGeneration;
      }

      return `Log in to get access to premium content for FREE. <br />
Sign up to share your name, email with this website in exchange for FREE access`;
    }
  }

  if (product && wall) {
    if (product.freeArticleCount && !wall.disableMeteredPaywall) {
      if (widgetConfig && widgetConfig.loginMessageFreeUnlock) {
        return widgetConfig.loginMessageFreeUnlock;
      }

      return `Log in to access up to ${product.freeArticleCount} FREE unlocks per month.`;
    }
  }
  return 'Log in to access premium content.';
};
