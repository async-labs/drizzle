import { assert } from 'chai';

import { getUserGuestMessage } from './util';

describe('communicateWithWidget:util', () => {
  describe('getUserGuestMessage', () => {
    it('return widgetConfig.loginMessageRegular if is not empty', () => {
      const widgetConfig = {
        loginMessageRegular: 'Login Test Message',
      };
      const message = getUserGuestMessage({ widgetConfig });

      assert.equal(message, widgetConfig.loginMessageRegular);
    });

    describe('when no condition is satisfied', () => {
      it('return "Log in to access premium content." message', () => {
        const message = getUserGuestMessage({});
        assert.equal(message, 'Log in to access premium content.');
      });
    });
  });
});
