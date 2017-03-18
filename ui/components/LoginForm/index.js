import React, { PropTypes } from 'react';
import {
  SubmitButton,
  FacebookButton,
  Input,
  FormFooterLinks,
} from '../';

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '0px !important',
    backgroundColor: 'white',
  },
  input: {
    marginBottom: '15px !important',
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

const LoginForm = ({
  fields,
  isSubmiting,
  onFacebookClick,
  onSubmit,
  style,
}) => (
  <div style={style}>
    <div style={styles.header}>
      <p style={styles.cta}> Log in to access premium content </p>
    </div>

    <FacebookButton
      label={'Log in with Facebook'}
      style={{ width: '100%' }}
      disabled={isSubmiting}
      onClick={onFacebookClick}
    />

    <form
      id="drizzle-login-form"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(event);
      }}
      style={styles.form}
    >

      <h3 className="center separator">or</h3>

      <Input
        placeholder="Email"
        name="email"
        type="email"
        disabled={isSubmiting}
        style={styles.input}
        defaultValue={fields.email}
        required
        fullWidth
      />

      <Input
        placeholder="Password"
        name="password"
        type="password"
        disabled={isSubmiting}
        style={styles.input}
        required
        fullWidth
      />


      <SubmitButton
        label={'Log in to Drizzle'}
        submitingLabel={'Wait...'}
        isSubmiting={isSubmiting}
        fullWidth
        style={styles.submitButton}
      />

      <FormFooterLinks
        links={[{
          id: 'drizzle-register-link',
          href: '/register',
          label: 'Sign up',
        }, {
          id: 'drizzle-recover-password-link',
          href: '/recover-password',
          label: 'Forgot Password?',
        }, {
          id: 'drizzle-register-link',
          href: 'https://getdrizzle.com/visitors',
          target: '_blank',
          label: 'Why Drizzle?',
        }]}
      />
    </form>
  </div>
);

LoginForm.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.string,
  }),
  /**
   * Function to login on facebook
   */
  onFacebookClick: PropTypes.func.isRequired,
  /**
   * Function to login with email and Password
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * When user click on submit, we change this prop to true
   * to display a loading state
   */
  isSubmiting: PropTypes.bool.isRequired,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

LoginForm.defaultProps = {
  isSubmiting: false,
  fields: {
    email: '',
    password: '',
  },
};

export default LoginForm;
