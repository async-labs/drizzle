import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_CANCELLED,
  RECOVER_PASSWORD_REQUEST,
  RECOVER_PASSWORD_SUCCESS,
  RECOVER_PASSWORD_ERROR,
} from './actions';

const initialState = {
  isAuthenticating: false,
  isRecoveringPassword: false,
  isRecoverPaswordEmailSent: false,
  error: undefined,
};

const userReducer = (state = initialState, { type, ...payload }) => {
  switch (type) {
    case AUTH_REQUEST:
      return {
        error: undefined,
        isAuthenticating: true,
        isRecoveringPassword: false,
        isRecoverPaswordEmailSent: false,
        ...payload,
      };
    case AUTH_SUCCESS:
      return {
        ...initialState,
      };
    case AUTH_CANCELLED:
      return {
        ...state,
        isAuthenticating: false,
      };
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticating: false,
        error: payload.error,
      };
    case RECOVER_PASSWORD_REQUEST:
      return {
        ...state,
        error: undefined,
        isRecoveringPassword: true,
        isRecoverPaswordEmailSent: false,
      };
    case RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        error: undefined,
        isRecoveringPassword: false,
        isRecoverPaswordEmailSent: true,
      };
    case RECOVER_PASSWORD_ERROR:
      return {
        ...state,
        isRecoveringPassword: false,
        isRecoverPaswordEmailSent: false,
        error: payload.error,
      };
    default:
      return state;
  }
};

export default userReducer;
