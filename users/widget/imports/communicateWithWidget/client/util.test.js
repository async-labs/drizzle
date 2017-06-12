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

    describe('when wall donation is enabled', () => {
      it('return "Log in to make a donation" message', () => {
        const wall = {
          donationEnabled: true,
        };

        const message = getUserGuestMessage({ wall });

        assert.equal(message, 'Log in to make a donation.');
      });

      describe('when wall donation is disabled', () => {
        describe('and wall lead generation is enabled', () => {
          const wall = { leadGeneration: true };

          it('return widgetConfig message if is not emtpy', () => {
            const widgetConfig = {
              loginMessageLeadGeneration: 'Lead Generation message',
            };

            const message = getUserGuestMessage({ wall, widgetConfig });

            assert.equal(message, widgetConfig.loginMessageLeadGeneration);
          });

          it('return fallback message if widgetConfig message is empty', () => {
            const message = getUserGuestMessage({ wall });
            const fallbackMessage = `Log in to get access to premium content for FREE. <br />
Sign up to share your name, email with this website in exchange for FREE access`;

            assert.equal(message, fallbackMessage);
          });
        });
        describe('and product has freeArticleCount and metered paywall is enabled', () => {
          const product = { freeArticleCount: 5 };
          const wall = { disableMeteredPaywall: false };
          const widgetConfig = { loginMessageFreeUnlock: 'Free unlocks message.' };

          it('return widgetConfig message if is not empty', () => {
            const message = getUserGuestMessage({ product, wall, widgetConfig });

            assert.equal(message, widgetConfig.loginMessageFreeUnlock);
          });

          it('return fallback message if widgetConfig message is empty', () => {
            const message = getUserGuestMessage({ product, wall });
            const fallbackMessage =
              `Log in to access up to ${product.freeArticleCount} FREE unlocks per month.`;

            assert.equal(message, fallbackMessage);
          });
        });
      });
    });

    describe('when no condition is satisfied', () => {
      it('return "Log in to access premium content." message', () => {
        const message = getUserGuestMessage({});
        assert.equal(message, 'Log in to access premium content.');
      });
    });
  });
});
