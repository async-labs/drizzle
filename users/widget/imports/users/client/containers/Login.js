import { getCurrentProduct } from '/imports/products/client/api';
import { login, loginWithFacebook } from '../actions';
import { connect } from 'react-redux';
import { composeWithTracker, composeAll } from 'react-komposer';

import Login from '../components/Login';

function compose(props, onData) {
  const product = getCurrentProduct();
  if (!product) {
    return null;
  }

  return onData(null, {
    product,
  });
}

const mapStateToProps = (state) => {
  const { isAuthenticating } = state.user;
  return {
    isSubmiting: isAuthenticating,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFacebookClick: () => dispatch(loginWithFacebook()),
  onSubmit({ target } = event) {
    const { email, password } = target;

    dispatch(login({
      email: email.value.trim(),
      password: password.value.trim(),
    }));
  },

});

export default composeAll(
  composeWithTracker(compose),
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
