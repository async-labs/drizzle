import React, { PropTypes } from 'react';
import { Button, Input } from '/imports/ui/components';

const styles = {
  submitButton: {
    marginTop: 15,
  },
};

const InvitationForm = ({ onSubmit }) => (
  <div style={{ textAlign: 'center', marginBottom: 10 }}>
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit(event);
      }}
    >
      <Input
        type="email"
        name="email"
        placeholder="Email address"
        fullWidth
        required
      />

      <Button
        label="Send Invite"
        btnSize={'small'}
        btnStyle={'warning'}
        type="submit"
        fullWidth
        style={styles.submitButton}
      />
    </form>
  </div>
);

InvitationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default InvitationForm;
