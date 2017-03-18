import { connect } from 'react-redux';
import { recoverPassword } from '../actions';

import { RecoverPasswordForm } from '/imports/ui/components';

const mapStateToProps = state => {
  const { isRecoveringPassword, isRecoverPaswordEmailSent } = state.user;
  return {
    isSubmiting: isRecoveringPassword,
    isRecoverPaswordEmailSent,
  };
};

const mapDispatchToProps = dispatch => ({
  onSubmit({ target } = event) {
    const { email } = target;

    dispatch(recoverPassword({ email: email.value }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPasswordForm);
