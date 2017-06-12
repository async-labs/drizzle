import React, { PropTypes } from 'react';
import { SubmitButton, Input, FormFooterLinks } from '/imports/ui/components';

const styles = {
  root: {
    textAlign: 'center',
  },
  cta: {
    margin: '10px 5px !important',
  },
  promoCodeInput: {
    textAlign: 'center',
    marginBottom: 15,
  },
};

const PromoCode = ({ onSubmit, promoCode }) => (
  <div style={styles.root}>
    <p style={styles.cta}> Add a referral code you received from friend! </p>

    <form
      id="drizzle-promocode-form"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(event);
      }}
    >

      <Input
        name={'promoCode'}
        defaultValue={promoCode}
        placeholder={'Enter your referral code here'}
        style={styles.promoCodeInput}
        required
        fullWidth
      />

      <SubmitButton
        label={'Use this code!'}
        btnStyle={'warning'}
        fullWidth
      />

      <FormFooterLinks
        links={[{
          id: 'drizzle-register-link',
          href: '/register',
          label: 'Back to Signup',
        }]}
      />

    </form>
  </div>
);

PromoCode.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  promoCode: PropTypes.string,
};

export default PromoCode;
