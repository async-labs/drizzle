import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { get } from '/imports/products/client/currentUrl';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';

import { error, success } from '/imports/notifier';


export const AUTH_REQUEST = 'AUTH_REQUEST';
export function authUserRequest(payload) {
  return {
    type: AUTH_REQUEST,
    ...payload,
  };
}

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export function authUserSuccess() {
  return {
    type: AUTH_SUCCESS,
  };
}

export const AUTH_ERROR = 'AUTH_ERROR';
export function authUserError(err) {
  return {
    type: AUTH_ERROR,
    error: err,
  };
}

export const AUTH_CANCELLED = 'AUTH_CANCELLED';
export function authUserCancelled() {
  return {
    type: AUTH_CANCELLED,
  };
}

export const VALIDATE_PROMO_CODE_SUCCESS = 'VALIDATE_PROMO_CODE_SUCCESS';
export function validatePromoCodeSuccess(promoCode) {
  return {
    type: VALIDATE_PROMO_CODE_SUCCESS,
    promoCode,
  };
}

export const VALIDATE_PROMO_CODE_ERROR = 'VALIDATE_PROMO_CODE_ERROR';
export function validatePromoCodeError(err) {
  return {
    type: VALIDATE_PROMO_CODE_ERROR,
    error: err,
  };
}

export const RECOVER_PASSWORD_REQUEST = 'RECOVER_PASSWORD_REQUEST';
export function recoverPasswordRequest() {
  return {
    type: RECOVER_PASSWORD_REQUEST,
  };
}

export const RECOVER_PASSWORD_SUCCESS = 'RECOVER_PASSWORD_SUCCESS';
export function recoverPasswordSuccess() {
  return {
    type: RECOVER_PASSWORD_SUCCESS,
  };
}

export const RECOVER_PASSWORD_ERROR = 'RECOVER_PASSWORD_ERROR';
export function recoverPasswordError(err) {
  return {
    type: RECOVER_PASSWORD_ERROR,
    error: err,
  };
}

export const login = ({ email, password }) => dispatch => {
  dispatch(authUserRequest({ email, password }));
  Meteor.loginWithPassword(email, password, err => {
    if (err) {
      if (err.reason === 'User has no password set') {
          err.reason = 'User has no password set, use Facebook login'; // eslint-disable-line
      }

      dispatch(authUserError(err));
      return error(err);
    }

    return dispatch(authUserSuccess());
  });
};

export const addPromoCode = (promoCode) => dispatch => {
  // dispatch(validatePromoRequest(promoCode));
  Meteor.call('referral.validatePromoCode', { promoCode }, err => {
    if (err) {
      dispatch(validatePromoCodeError(err));
      error(err);
      return;
    }

    dispatch(validatePromoCodeSuccess(promoCode));

    success('You successfully added a promo code!');
    FlowRouter.go('/register');
  });
};


export const register = ({ profile, email, password, promoCode }) => dispatch => {
  const options = {
    profile, email, password,
  };

  dispatch(authUserRequest(options));
  Accounts.createUser(options, (err) => {
    if (err) {
      error(err);
      dispatch(authUserError(err));
      return;
    }

    const product = getCurrentProduct();
    const wall = getCurrentWall();

    Meteor.call('users.registered', {
      url: get(),
      productId: product._id,
      wallId: wall && wall._id,
      promoCode: promoCode || '',
    });

    dispatch(authUserSuccess());
  });
};


export const loginWithFacebook = (promoCode = '') => dispatch => {
  dispatch(authUserRequest());
  const options = {
  };

  Meteor.loginWithFacebook(options, (err) => {
    if (!err) {
      const product = getCurrentProduct();
      const wall = getCurrentWall();

      Meteor.call('users.registered', {
        url: get(),
        productId: product._id,
        wallId: wall && wall._id,
        promoCode: promoCode || '',
      });

      dispatch(authUserSuccess());
    } else if (err instanceof Accounts.LoginCancelledError) {
      dispatch(authUserCancelled());
    } else if (err instanceof ServiceConfiguration.ConfigError) {
      dispatch(authUserError(err));
      error(err.message || 'Unknown error');
    } else {
      dispatch(authUserError(err));
      error(err.reason || 'Unknown error');
    }
  });
};

export const recoverPassword = ({ email }) => dispatch => {
  dispatch(recoverPasswordRequest());

  Meteor.call('auth/recoverPassword', email, get(), (err) => {
    if (err) {
      dispatch(recoverPasswordError(err));
      return error(err.reason || 'Error sending email, please try again later');
    }

    dispatch(recoverPasswordSuccess());
    return success('Thanks! We sent you an email with reset password instructions.');
  });
};


export function sendVerifyEmail(callback) {
  Meteor.call('users.sendVerifyEmail', get(), (err, result) => {
    if (callback) { callback(err, result); }
  });
}
