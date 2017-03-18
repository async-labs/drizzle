import { notificationSystem } from '../layouts/components/MainLayout.jsx';

export function error(err) {
  if (err) {
    notificationSystem({
      message: err.reason || err.message || err.toString(),
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
