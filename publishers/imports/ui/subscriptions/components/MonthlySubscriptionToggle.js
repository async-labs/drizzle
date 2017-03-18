import React, { PropTypes } from 'react';

import {
  ConfigurationBox,
  ConfigurationInput,
  ConfigurationToggle,
  SubmitButton,
} from '/imports/ui/components';

const MonthlySubscriptionToggle = ({ onToggle, onSubmit, toggled, amount, stripePlanId }) => (
  <ConfigurationToggle
    name="Site-wide MONTHLY subscription plan"
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationBox
      title={'Site-wide MONTHLY subscription plan'}
      collapsed
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
          subtitle={'Any amount ($0.00) between $5.00 to $50.00 a month for paid subscription.'}
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
    </ConfigurationBox>
  </ConfigurationToggle>
);

MonthlySubscriptionToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  stripePlanId: PropTypes.string,
  toggled: PropTypes.bool.isRequired,
};

export default MonthlySubscriptionToggle;
