import React, { PropTypes } from 'react';
import {
  SubmitButton,
  FacebookButton,
  Input,
  FormFooterLinks,
} from '../';


const styles = {
  termsContainer: {
    textAlign: 'center',
    width: 'auto !important',
  },
  termsInput: {
    width: '14px !important',
    height: '14px !important',
    margin: '7px 0px 10px 0px !important',
    display: 'inline !important',
    boxShadow: 'none !important',
    WebkitAppearance: 'checkbox !important',
    verticalAlign: 'baseline !important',
  },
  footer: {
    fontSize: '13px !important',
    marginTop: '10px !important',
  },
  header: {
    textAlign: 'center',
    marginBottom: 0,
    backgroundColor: 'white',
  },
  promoCodeContainer: {
    padding: '8px 10px !important',
    backgroundColor: '#df8a13 !important',
    marginBottom: '10px !important',
    color: 'white',
    borderRadius: 4,
  },
  input: {
    marginBottom: '15px !important',
  },
  input5: {
    marginBottom: '5px !important',
  },
  submitButton: {
    margin: '0px !important',
  },
  form: {
    backgroundColor: 'white !important',
  },
  cta: {
    margin: '10px !important',
  },
};

const RegisterForm = ({
  fields,
  isSubmiting,
  onFacebookClick,
  onSubmit,
  showPromoCodeLink,
  promoCode,
  style,
}) => (
  <div style={style}>
    <div style={styles.header}>
      {promoCode ? (
        <div style={styles.promoCodeContainer}>
          You are signing up with a promo code!
        </div>
      ) : (
        <p style={styles.cta}> Sign up to access premium content </p>
      )}
    </div>

    <FacebookButton
      style={{ width: '100%' }}
      label={'Sign up with Facebook'}
      onClick={() => onFacebookClick(promoCode)}
      disabled={isSubmiting}
    />

    <form
      id="drizzle-register-form"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(event, promoCode);
      }}
      style={styles.form}
    >
      <h3 className="center separator">
        or
      </h3>

      <Input
        placeholder="First Name"
        type="text"
        name="firstName"
        required
        defaultValue={fields.firstName}
        disabled={isSubmiting}
        style={{ width: '49%', float: 'left', ...styles.input }}
      />

      <Input
        placeholder="Last Name"
        name="lastName"
        type="text"
        required
        defaultValue={fields.lastName}
        disabled={isSubmiting}
        style={{ width: '49%', float: 'right', ...styles.input }}
      />

      <Input
        placeholder="Email"
        type="email"
        name="email"
        autoComplete
        required
        defaultValue={fields.email}
        disabled={isSubmiting}
        style={styles.input}
        fullWidth
      />

      <Input
        placeholder="Password"
        name="password"
        type="password"
        required
        disabled={isSubmiting}
        style={styles.input5}
        fullWidth
      />

      <div style={styles.termsContainer}>
        <label>
          <input
            style={styles.termsInput}
            type="checkbox"
            name="terms"
            required
            disabled={isSubmiting}
          />
          &nbsp;Accept <a href="https://getdrizzle.com/terms" target="_blank">Terms</a>
        </label>
      </div>

      <div className="center">
        <SubmitButton
          label={'Sign up for Drizzle'}
          submitingLabel={'Wait...'}
          type="submit"
          isSubmiting={isSubmiting}
          fullWidth
          style={styles.submitButton}
        />
      </div>

      <FormFooterLinks
        links={[{
          id: 'drizzle-login-link',
          href: '/login',
          label: 'Log in',
        }, showPromoCodeLink && {
          id: 'drizzle-promocode-link',
          href: '/promo-code',
          label: 'Add Referral Code',
        }, {
          href: 'https://getdrizzle.com/visitors',
          target: '_blank',
          label: 'Why Drizzle?',
        }]}
      />
    </form>
  </div>
);

RegisterForm.propTypes = {
  fields: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
  /**
   * Function to login on facebook
   */
  onFacebookClick: PropTypes.func,
  /**
   * Function to register manually
   */
  onSubmit: PropTypes.func,
  /**
   * When user click on submit, we change this prop to true
   * to display a loading state
   */
  isSubmiting: PropTypes.bool.isRequired,
  /**
   * Shows PromoCode link if enabled
   */
  showPromoCodeLink: PropTypes.bool,
  /**
   * Promocode from user input
   */
  promoCode: PropTypes.string,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

RegisterForm.defaultProps = {
  isSubmiting: false,
  showPromoCodeLink: false,
  fields: {
    firstName: '',
    lastName: '',
    email: '',
  },
};

export default RegisterForm;
