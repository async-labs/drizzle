import { notificationSystem } from '../client/Layout';

export function error(err) {
  if (err) {
    notificationSystem({
      message: err.reason || err.toString(),
      level: 'error',
    });
  }
}

export function success(message) {
  notificationSystem({
    message,
    level: 'success',
  });
}

export function warning(message) {
  notificationSystem({
    message,
    level: 'warning',
  });
}

export default {
  error,
  warning,
  success,
};
