import React, { PropTypes } from 'react';
import {
  ConfigurationBox,
  ConfigurationInput,
  SubmitButton,
} from '/imports/ui/components';

const StripeForm = ({ onSubmit, secretKey, publishableKey }) => (
  <ConfigurationBox
    title={'Stripe Configuration'}
    collapsed
  >
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          secretKey: event.target.secretKey.value,
          publishableKey: event.target.publishableKey.value,
        });
      }}
    >
      <ConfigurationInput
        name="Secret KEY"
        inputName={'secretKey'}
        isForm={false}
        value={secretKey}
      />

      <ConfigurationInput
        name="Publishable KEY"
        inputName={'publishableKey'}
        isForm={false}
        value={publishableKey}
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
  );

StripeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  publishableKey: PropTypes.string,
  secretKey: PropTypes.string,
};

export default StripeForm;
