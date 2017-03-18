import React from 'react';

import Button from '/imports/ui/components/Button';

export default function UpdatePaymentInfo() {
  return (
    <div className="zenmarket--control-block login-section">
      <div className="read-more">
        <hr className="paywall margin-t-0" />

        <p className="login-cta">
          Your card is declined. Please update card info.
        </p>

        <Button
          className={'zenmarket--update-card-info-button'}
          label={'Update payment information'}
        />
      </div>
    </div>
  );
}
