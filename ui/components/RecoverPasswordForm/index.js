import React, { PropTypes } from 'react';
import {
  SubmitButton,
  Input,
  FormFooterLinks,
} from '../';

const styles = {
  input: {
    marginBottom: 15,
  },
  header: {
    textAlign: 'center',
  },
};

const RecoverPasswordForm = ({ onSubmit, isSubmiting, style }) => (
  <div style={style}>
    <header style={styles.header}>
      <p> Provide your email and we will email you a link to reset password.</p>
    </header>
    <form
      id="drizzle-recover-password-form"
      onSubmit={event => {
        event.preventDefault();
        onSubmit(event);
      }}
      style={style}
    >
      <Input
        type="email"
        name="email"
        placeholder="Email"
        disabled={isSubmiting}
        fullWidth
        required
        style={styles.input}
      />

      <SubmitButton
        btnStyle={'warning'}
        label={'Recover password'}
        submitingLabel={'Wait...'}
        isSubmiting={isSubmiting}
        fullWidth
      />

      <FormFooterLinks
        links={[{
          id: 'drizzle-login-link',
          href: '/login',
          label: 'Back to Login',
        }]}
      />
    </form>
  </div>
);

RecoverPasswordForm.propTypes = {
  isSubmiting: PropTypes.bool,
  /**
   * Function to handle password recover
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

RecoverPasswordForm.defaultProps = {
  isSubmiting: false,
};


export default RecoverPasswordForm;
