import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
  SubmitButton,
} from '/imports/ui/components';

const AnnualSubscriptionToggle = ({ onToggle, onSubmit, toggled, amount, stripePlanId }) => (
  <ConfigurationToggle
    name="Site-wide ANNUAL subscription plan"
    toggled={toggled}
    onToggle={onToggle}
  >
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          amount: event.target.amount.value,
          stripePlanId: event.target.stripePlanId.value,
        });
      }}
    >
      <ConfigurationInput
        name="Pick the subscription amount"
        subtitle={'Any amount ($0.00) between $5.00 to $500.00 a month for paid subscription.'}
        inputName="amount"
        value={amount}
        isForm={false}
      />

      <ConfigurationInput
        name="Stripe plan ID"
        inputName="stripePlanId"
        isForm={false}
        value={stripePlanId || ''}
      />

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <SubmitButton
          btnStyle={'warning'}
          btnSize={'small'}
          label={'Save'}
        />
      </div>
    </form>
  </ConfigurationToggle>
);

AnnualSubscriptionToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  stripePlanId: PropTypes.string,
  toggled: PropTypes.bool.isRequired,
};

export default AnnualSubscriptionToggle;
