import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { KeyValues } from 'meteor/drizzle:models';

import { connect } from 'react-redux';
import { composeWithTracker, composeAll } from 'react-komposer';

import { getCurrentProduct } from '/imports/products/client/api';
import { error } from '/imports/notifier';
import { register, loginWithFacebook } from '../actions';

import Register from '../components/Register';

function composer(props, onData) {
  let benefits;
  const product = getCurrentProduct();

  if (Meteor.subscribe('keyValues/getByKey', 'widgetConfig').ready()) {
    const widgetConfig = KeyValues.findOne({ key: 'widgetConfig' });

    if (widgetConfig && widgetConfig.value && widgetConfig.value.benefits) {
      benefits = _.filter(widgetConfig.value.benefits.split('\n').map(b => b.trim()), i => !!i);
    }

    onData(null, {
      benefits,
      showPromoCodeLink: product.isReferralEnabled(),
    });
  }
}

const mapStateToProps = state => {
  const { isAuthenticating, promoCode } = state.user;
  return {
    isSubmiting: isAuthenticating,
    promoCode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFacebookClick: (event, promoCode) => dispatch(loginWithFacebook(promoCode)),
  onSubmit({ target } = event, promoCode) {
    const { firstName, lastName, email, password, terms } = target;

    if (!terms.checked) {
      error('Please agree with the terms');
      return;
    }

    dispatch(register({
      profile: {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      },
      email: email.value.trim(),
      password: password.value.trim(),
      promoCode,
    }));
  },
});

export default composeAll(
  composeWithTracker(composer),
  connect(mapStateToProps, mapDispatchToProps)
)(Register);
