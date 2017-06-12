/* globals $, API_URL */

import { sendCommand, eventEmitter } from './widget.js';
import { handleTabs } from './tabs';
import { handleDropdown } from './dropdown';
import { handleSlider } from './slider';
import { showWidget, showWidgetIcon, showFooterBar, hideFooterBar } from './interact';

// Add event listeners helper
const addClickListener = (element, handler) =>
element && element.addEventListener('click', handler);

const addSubmitListener = (element, handler) =>
element && element.addEventListener('submit', handler);

function renderInitial(callback) {
  const wrapper = document.getElementById('zenmarket--wrapper');
  const wallContainer = document.querySelector('.zenmarket--wall-container');
  const upsellContainer = document.querySelector('.zenmarket--upsell-container');

  if (wrapper) {
    if (wallContainer && upsellContainer) {
      if (callback) {
        callback({ wrapper, wallContainer, upsellContainer });
        return;
      }
    } else {
      wrapper.innerHTML = `
      <div class='zenmarket--wall-container'"></div>
      <div class='zenmarket--upsell-container'"></div>
    `;

      wrapper.classList.add('drizzle-fade-in');
      renderInitial(callback);
    }
  }
}

/**
* Assign events to PaywallGuestView components
*/
function initPaywallGuestView() {
  const GuestCallToActionButton = document.getElementById('GuestCallToActionButton');

  if (GuestCallToActionButton) {
    GuestCallToActionButton.
    addEventListener('click', () => {
      /**
       * If already clicked, we show the iframe
       * otherwise we display the login and signup buttons.
       */
      if (localStorage.getItem('callToActionClicked')) {
        showWidget();
      } else {
        localStorage.setItem('callToActionClicked', true);
        sendCommand({ command: 'callToActionClick' });
      }
    });
  }
}

function initPaywall() {
// Elements
  const payButton = document.querySelector('.zenmarket--pay-button');
  const dayAccessButton = document.querySelector('.zenmarket--day-access-button');
  const buyPlanButton = document.querySelector('.zenmarket--buy-plan-button');
  const subscribeButton = document.querySelector('.zenmarket--subscribe-button');
  const updateCardButton = document.querySelector('.zenmarket--update-card-info-button');
  const unlockButton = document.querySelector('.zenmarket--unlock-button');
  const generateLeadButton = document.querySelector('.zenmarket--generate-lead-button');
  const upvoteButton = document.querySelector('.zenmarket--upvote-button');
  const readLaterButton = document.querySelector('.zenmarket--read-later');
  const thumbnail = document.querySelector('.zenmarket--thumbnail');

// Event handlers
  const onPayButtonClick = () => sendCommand({ command: 'pay' });
  const onDayAccessButtonClick = () => sendCommand({ command: 'buyDailyAccess' });
  const onBuyPlanButtonClick = () => sendCommand({ command: 'buyPlan' });
  const onUnlockButtonClick = () => sendCommand({ command: 'unlock' });
  const onGenerateLeadButtonClick = () => sendCommand({ command: 'generateLead' });

  const onSubscribeButtonClick = () => {
    showWidget();
    sendCommand({ command: 'showSubscribePage' });
  };

  const onUpvoteButtonClick = () => {
    showWidget();
    sendCommand({ command: 'upvote' });
  };

  const onReadLaterButtonClick = () => {
    sendCommand({ command: 'readLater' });
  };

  const onThumbnailClick = () => {
    showWidget();
    sendCommand({
      command: 'showNotification',
      text: 'Login with Drizzle and click Pay button to purchase this video.',
      level: 'warning',
    });
  };

  const onUpdateCardButtonClick = () => {
    showWidget();
    sendCommand({ command: 'updateCardInfo' });
  };


// Assign event listeners
  addClickListener(payButton, onPayButtonClick);
  addClickListener(dayAccessButton, onDayAccessButtonClick);
  addClickListener(buyPlanButton, onBuyPlanButtonClick);
  addClickListener(subscribeButton, onSubscribeButtonClick);
  addClickListener(updateCardButton, onUpdateCardButtonClick);
  addClickListener(unlockButton, onUnlockButtonClick);
  addClickListener(generateLeadButton, onGenerateLeadButtonClick);
  addClickListener(upvoteButton, onUpvoteButtonClick);
  addClickListener(readLaterButton, onReadLaterButtonClick);
  addClickListener(thumbnail, onThumbnailClick);
}

function initRegisterForm() {
  const loginForm = document.getElementById('drizzle-login-form');
  const registerForm = document.getElementById('drizzle-register-form');
  const promoCodeLink = document.getElementById('drizzle-promocode-link');
  const recoverPasswordLink = document.getElementById('drizzle-recover-password-link');
  const recoverPasswordForm = document.getElementById('drizzle-recover-password-form');
  const loginLinkFromRegisterForm = document.querySelector('#drizzle-register-form #drizzle-login-link');
  const loginLinkFromRecoverPasswordForm = document.querySelector('#drizzle-recover-password-form #drizzle-login-link');
  const promoCodeForm = document.getElementById('drizzle-promocode-form');
  const facebookButton = document.querySelector('.drizzle-facebook-button');
  const registerLinkFromPromocodeForm = document.querySelector('#drizzle-promocode-form #drizzle-register-link');
  const registerLinkFromLoginForm = document.querySelector('#drizzle-login-form #drizzle-register-link');

  const submitSignupForm = ({ target } = event) => {
    event.preventDefault();

    const { firstName, lastName, email, password } = target;

    const data = {
      profile: {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      },
      email: email.value.trim(),
      password: password.value.trim(),
    };

    showWidget();
    sendCommand({
      command: 'signUp',
      options: data,
    });
  };

  const submitPromocodeForm = ({ target } = event) => {
    event.preventDefault();

    const { promoCode } = target;

    sendCommand({
      command: 'addPromoCode',
      promoCode: promoCode.value,
    });
  };

  const loginWithFacebook = () => {
    showWidget();
    sendCommand({
      command: 'loginWithFacebook',
    });
  };

  const submitLoginForm = ({ target } = event) => {
    event.preventDefault();

    const { email, password } = target;

    showWidget();
    sendCommand({
      command: 'login',
      options: {
        email: email.value.trim(),
        password: password.value.trim(),
      },
    });
  };

  const submitRecoverPasswordForm = ({ target } = event) => {
    event.preventDefault();

    const { email } = target;

    showWidget();
    sendCommand({
      command: 'recoverPassword',
      email: email.value,
    });
  };

  const togglePromocodeForm = (event) => {
    event.preventDefault();

    sendCommand({
      command: 'togglePromocodeForm',
    });
  };

  const toggleLoginForm = (event) => {
    event.preventDefault();

    sendCommand({
      command: 'toggleLoginForm',
    });
  };

  const toggleRecoverPasswordForm = (event) => {
    event.preventDefault();

    sendCommand({
      command: 'toggleRecoverPasswordForm',
    });
  };

// Add click listeners
  addClickListener(facebookButton, loginWithFacebook);
  addClickListener(registerLinkFromPromocodeForm, togglePromocodeForm);
  addClickListener(registerLinkFromLoginForm, toggleLoginForm);
  addClickListener(promoCodeLink, togglePromocodeForm);
  addClickListener(recoverPasswordLink, toggleRecoverPasswordForm);
  addClickListener(loginLinkFromRegisterForm, toggleLoginForm);
  addClickListener(loginLinkFromRecoverPasswordForm, toggleRecoverPasswordForm);

// Add submit listeners
  addSubmitListener(registerForm, submitSignupForm);
  addSubmitListener(loginForm, submitLoginForm);
  addSubmitListener(promoCodeForm, submitPromocodeForm);
  addSubmitListener(recoverPasswordForm, submitRecoverPasswordForm);
}

const commands = {
  renderWall(data) {
    renderInitial(({ wallContainer }) => {
      const { html } = data;

    /**
     * This makes the forms appear if the Read More button
     * was clicked before widget app loads.
     */
      if (localStorage.getItem('callToActionClicked')) {
        sendCommand({ command: 'callToActionClick' });
      }

      if (!html) {
        return;
      }

      wallContainer.innerHTML = html;

      if (data.isClientSide && data.isPaid) {
        const clientSideDiv = document.querySelector('.drizzle-client-side-content');
        const hiddenContentDiv = document.getElementById('zenmarket--hidden-content');

        clientSideDiv.innerHTML = hiddenContentDiv.innerHTML;
      }

      wallContainer.classList.add('drizzle-fade-in');

      initPaywall();
      initPaywallGuestView();
      initRegisterForm();

      handleDropdown();
      handleSlider();
    });
  },

  renderUpsellContent(data) {
    renderInitial(({ upsellContainer }) => {
      const { html } = data;

      upsellContainer.innerHTML = html;
      upsellContainer.classList.add('drizzle-fade-in');

      handleTabs();

      [...upsellContainer.querySelectorAll('a')].forEach(link => {
        addClickListener(link, () => {
          sendCommand({
            command: 'clickedOnUpsellingLink',
            url: link.href,
          });
        });
      });
    });
  },

  renderFooterBar(data) {
    const { html } = data;

    const footer = document.getElementById('zenmarket-footer');

    if (!footer) {
      const footerElement = document.createElement('div');

      footerElement.setAttribute('id', 'zenmarket-footer');
      window.document.body.appendChild(footerElement);

      commands.renderFooterBar(data);
      return;
    }

    footer.innerHTML = html;

    const footerBar = footer.querySelector('.drizzle-footer-bar');
    const footerButton = footerBar.querySelector('#drizzle-footer-button');
    const footerCloseButton = footerBar.querySelector('#footer-close-button');

    showFooterBar();

    if (footerButton) {
      footerButton.addEventListener('click', () => {
        showWidget();
        sendCommand({ command: 'footerButtonClick' });
      });
    }

    if (footerCloseButton) {
      footerCloseButton.addEventListener('click', () => {
        hideFooterBar();
      });
    }
  },

  showWidget() {
    showWidget();
    hideFooterBar();
  },

  showWidgetIcon() {
    showWidgetIcon();
  },

  hideFooterBar() {
    hideFooterBar();
  },

  checkViewport() {
    sendCommand({
      command: 'viewport',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  },

  userInfo(data) {
    eventEmitter.emitEvent('userInfoReady', [data.userInfo || {}]);
  },

  /**
   * Store and send login token to fix Iframe issue.
   */
  logout: () => window.localStorage.removeItem('loginToken'),
  saveLoginToken: (data) => window.localStorage.setItem('loginToken', data.loginToken),
  getLoginToken: () => sendCommand({
    command: 'loginWithToken',
    loginToken: window.localStorage.getItem('loginToken'),
  }),
};

export default commands;
