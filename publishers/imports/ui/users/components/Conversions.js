import React, { PropTypes } from 'react';

const Conversions = ({ rates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="cssload-container">
        <div className="cssload-loading"><i></i><i></i><i></i><i></i></div>
      </div>
    );
  }

  return (
    <div>
      <p>
        Signup - {rates.signupToTrial}% - Trial
        - {rates.trialToSubscription}% - Subscription
        - {rates.subscriptionToCancelSubscription}% - Cancel subscription
      </p>

      <p>
        Trial - {rates.trialToCancelTrial}% - Cancel trial
      </p>

      <p>
        Signup - {rates.signupToMicropaid}% - Single Payment
        - {rates.micropaidToTrial}% - Trial
      </p>
    </div>
  );
};

Conversions.propTypes = {
  isLoading: PropTypes.bool,
  rates: PropTypes.object,
};

export default Conversions;
