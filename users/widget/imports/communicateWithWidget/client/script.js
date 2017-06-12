/* globals $ */

import ReactDOMServer from 'react-dom/server';
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import './handleAuth';

import { FlowRouter } from 'meteor/kadira:flow-router';

import notifier from '/imports/notifier';

import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';
import { getFreeReadArticleCount } from '/imports/users/client/api';
import { buy, unlock, upvote, generateLead } from '/imports/products/client/actions';
import { readLater } from '/imports/savedWalls/client/actions';

import {
  login as loginAction,
  register as registerAction,
  loginWithFacebook as loginWithFacebookAction,
  addPromoCode as addPromoCodeAction,
  recoverPassword as recoverPasswordAction,
} from '/imports/users/client/actions';

import store from '/imports/client/store';

import {
  Plans,
  KeyValues,
  SavedWalls,
  ProductUsers,
  ContentWallCharges,
} from 'meteor/drizzle:models';

import sendCommand from './sendCommand';
import { renderUpsellContent } from './upsellContent';

import Paywall from './components/Paywall';
import UpdatePaymentInfo from './components/UpdatePaymentInfo.jsx';
import WidgetFooterBar from '/imports/ui/components/WidgetFooterBar';

const contentVar = new ReactiveVar(undefined);
const viewportVar = new ReactiveVar(undefined);
const callToActionClick = new ReactiveVar(false);
const socialProofVar = new ReactiveVar('');
const showPromoCodeForm = new ReactiveVar(false);
const showLoginForm = new ReactiveVar(false);
const showRecoverPasswordForm = new ReactiveVar(false);
const showFooterBar = new ReactiveVar(true);

import { get as getCurrentUrl } from '/imports/products/client/currentUrl';

let autoLead = false;
let wallProps;

/**
 * [renderMarkupAndStyles description]
 * @param  {Component} component The component to render
 * @return {{html, css}} A object containing static html and plain text css.
 */
const renderMarkup = (component) => {
  const html = ReactDOMServer.renderToString(component);

  return {
    html,
  };
};

export function getContent() {
  const wall = getCurrentWall();
  const content = contentVar.get();
  const viewport = viewportVar.get();

  Meteor.call('products.getWallContent', {
    wallId: wall._id,
    viewport,
  }, (err, res) => {
    if (err) {
      if (err.error !== 'already-given' && content !== null) {
        contentVar.set(null);
      }
    } else if (res !== content) {
      contentVar.set(res);
    }
  });
}

function subscriptions({ wall }) {
  const subs = [
    Meteor.subscribe('contentWalls.getWallChargeByWallId', wall._id).ready(),
    Meteor.subscribe('savedWalls.getByWallId', wall._id).ready(),
    Meteor.subscribe('keyValues/getByKey', 'widgetConfig').ready(),
  ];

  return _.every(subs);
}

Tracker.autorun((comp) => {
  const wall = getCurrentWall();
  if (!wall) { return; }

  const unique = !Meteor._localStorage.getItem(`Drizzle.viewed_wall_${wall._id}`);
  if (unique) {
    Meteor._localStorage.setItem(`Drizzle.viewed_wall_${wall._id}`, 1);
  }

  Meteor.call('products.increaseWallViewCount', { wallId: wall._id, unique });
  comp.stop();
});

// sending user state
Tracker.autorun(() => {
  const url = getCurrentUrl();
  if (!url || Meteor.loggingIn()) { return; }

  const content = contentVar.get();
  if (content === undefined) {
    return;
  }

  sendCommand({
    name: 'userInfo',
    url,
    data: {
      userInfo: { isUnlockedContent: !!content, isLoggedIn: !!Meteor.userId() },
    },
  });
});

function renderWidget() {
  /*
   * Show Footer Bar
   */
  Tracker.autorun(computation => {
    const url = getCurrentUrl();
    const product = getCurrentProduct();
    const wall = getCurrentWall();

    if (!url || !product) {
      return;
    }

    if (wall && wall.disabled) {
      computation.stop();
      return;
    }

    if (!product.isFooterBarEnabled) {
      sendCommand({
        name: 'hideFooterBar',
        url,
      });

      if (wall) {
        sendCommand({ name: 'showWidgetIcon', url });
      }

      return;
    }

    if (!wall && !product.isFooterBarEnabledOnAllPages) {
      sendCommand({
        name: 'hideFooterBar',
        url,
      });

      return;
    }

    sendCommand({ name: 'showWidgetIcon', url });

    const buttonLabel = Meteor.userId() ? 'My Account' : product.guestButtonText || 'Join us';
    const callToActionText = (Meteor.userId()
      ? 'Manage your subscription and payments.'
      : product.guestMessageText || 'Become a member to access premium content.'
    );

    if (showFooterBar.get()) {
      const footerBarRender = renderMarkup(
        <WidgetFooterBar
          buttonLabel={buttonLabel}
          callToActionText={callToActionText}
        />
      );

      sendCommand({
        name: 'renderFooterBar',
        url,
        data: {
          html: footerBarRender.html,
          isShowing: showFooterBar.get(),
        },
      });
    }
  });

  Tracker.autorun(computation => {
    const url = getCurrentUrl();
    const product = getCurrentProduct();
    const wall = getCurrentWall();

    if (!url || !wall || !product) {
      return;
    }

    const { isClientSide } = product;

    /**
     * Wall Disabled
     */
    if (wall.disabled) {
      getContent({});

      const content = contentVar.get();

      if (content) {
        const comp = (isClientSide
          ? <div className="drizzle-client-side-content" />
          : <div dangerouslySetInnerHTML={{ __html: content }} />);

        const html = ReactDOMServer.renderToStaticMarkup(comp);

        sendCommand({
          name: 'renderWall',
          url: getCurrentUrl(),
          data: {
            html,
            isClientSide,
            isPaid: true,
          },
        });

        computation.stop();
      }
      return;
    }

    if (viewportVar.get() === undefined && wall.viewportConfig && !wall.viewportConfig.disabled) {
      // console.log('Lets check viewport! (script.js)');
      sendCommand({ name: 'checkViewport', url });
      return;
    }

    /**
     * Wall with mobile settings
     */
    if (wall.viewportConfig && viewportVar.get()) {
      if (!wall.viewportConfig.disabled && viewportVar.get().width > wall.viewportConfig.width) {
        // console.log('Now I will get content. (script.js)');

        Meteor.call('products.getWallContent', {
          wallId: wall._id,
          viewport: viewportVar.get(),
        }, (err, content) => {
          // console.log('content', content);
          // console.log('I received the response from method. (script.js)');

          if (err) {
            console.error(err);
            return;
          }

          const comp = (isClientSide
            ? <div className="drizzle-client-side-content" />
            : <div dangerouslySetInnerHTML={{ __html: content }} />);

          const html = ReactDOMServer.renderToStaticMarkup(comp);

          sendCommand({
            name: 'renderWall',
            url: getCurrentUrl(),
            data: {
              html,
              isClientSide,
              isPaid: true,
            },
          });
          computation.stop();
        });
        return;
      }
    }

    /**
     * get product user count if social proof is enable
     */
    const { socialProof } = product;
    if (socialProof && socialProof.isEnabled && socialProofVar.get() === '') {
      socialProofVar.get(null);
      Meteor.call('products.getUserCount', { productId: product._id }, (err, count) => {
        if (err) {
          return;
        }

        socialProofVar.set(`${count} ${socialProof.message || 'people have purchased on this website'}`);
      });
    }

    const user = Meteor.user();
    if (Meteor.loggingIn()) { return; }

    if (!subscriptions({ wall })) {
      return;
    }

    const content = contentVar.get();

    getContent({});

    const unlockedCount = getFreeReadArticleCount();

    let plan;
    const planIds = wall.subscriptionPlanIds;
    if (planIds && planIds.length > 0) {
      plan = Plans.findOne(planIds[0]);
    }

    const subscriptionEnabled = !!(
      (product.subscriptionEnabled &&
       product.subscription &&
       product.subscription.amount) || (
         product.weeklySubscriptionEnabled &&
         product.weeklySubscription &&
         product.weeklySubscription.amount) || plan
    );

    let userSubscribed = false;
    if (subscriptionEnabled && user) {
      userSubscribed = !!(user.subscribedProducts &&
      user.subscribedProducts.indexOf(product._id) !== -1);

      if (!userSubscribed) {
        userSubscribed = !!(user.weeklySubscribedProducts &&
        user.weeklySubscribedProducts.indexOf(product._id) !== -1);
      }

      if (!userSubscribed && plan) {
        userSubscribed = !!(user.subscribedPlans &&
        user.subscribedPlans.indexOf(plan._id) !== -1);
      }
    }

    let charge;
    let productUser = {};

    if (user) {
      charge = ContentWallCharges.findOne({
        wallId: wall._id,
        userId: user._id,
        $or: [
          { expiredAt: { $exists: false } },
          { expiredAt: { $gt: new Date() } },
        ],
      });

      productUser = ProductUsers.findOne({ userId: user._id, productId: product._id }) || {};
    }

    /**
     * If user's card is declined, show only update card button
     */
    if (user && user.isCardDeclined) {
      const { html } = renderMarkup(
        <UpdatePaymentInfo />
      );

      sendCommand({ name: 'renderWall', url, data: { html } });
      return;
    }

    const widgetConfig = KeyValues.findOne({ key: 'widgetConfig' });

    wallProps = {
      user,
      product,
      wall,
      unlockedCount,
      paid: !!content,
      alreadySaved: !!SavedWalls.findOne({ wallId: wall._id, userId: Meteor.userId() }),
      disableMeteredPaywall: !!wall.disableMeteredPaywall,
      content,
      purchasedCount: productUser.purchasedCount,
      subscriptionEnabled,
      widgetConfig: widgetConfig && widgetConfig.value || {},
      charge,
      userSubscribed,
      showMessage: callToActionClick.get(),
      socialProof: socialProofVar.get(),
      showPromoCodeForm: showPromoCodeForm.get(),
      showRecoverPasswordForm: showRecoverPasswordForm.get(),
      showLoginForm: showLoginForm.get(),
      userStore: store.getState().user,
    };

    // -----------------------
    // Render Main Paywall
    // -----------------------
    const { html } = renderMarkup(<Paywall {...wallProps} />);
    sendCommand({
      name: 'renderWall',
      url,
      data: {
        html,
        isClientSide,
        isPaid: !!content,
      },
    });


    // unlock automatically if user registered at this site.
    if (wall.leadGeneration && !autoLead && !content) {
      const isRegisteredAtIt = user && user.registeredAt && user.registeredAt.startsWith(product.url);
      if (!isRegisteredAtIt) { return; }

      autoLead = true;
      generateLead(wall._id, (err) => {
        if (err && err.error !== 'already-unlocked') {
          sendCommand({ name: 'showWidget', url });
          notifier.error(err);
        } else {
          getContent({});
          notifier.success('Thank you!');
        }
      });
    }
  });
}

const commands = {
  /**
   * Used to make loginButtons for guests appear
   */
  callToActionClick: () => {
    callToActionClick.set(true);
    const wall = getCurrentWall();

    if (wall) {
      Meteor.call('contentWalls.callToActionClicked', { wallId: wall._id });
    }
  },

  footerButtonClick: () => {
    const wall = getCurrentWall();

    if (wall) {
      Meteor.call('contentWalls.footerButtonClicked', { wallId: wall._id });
    }
  },

  /**
   * Navigation
   */
  showLoginPage: () => FlowRouter.go('/login'),
  showSignupPage: () => FlowRouter.go('/register'),
  showSubscribePage: () => {
    if (Meteor.userId()) {
      FlowRouter.go('/');
      return;
    }
    notifier.error('Login required');
  },

  unlock() {
    const url = getCurrentUrl();
    const wall = getCurrentWall();
    if (!wall) { return; }

    sendCommand({ name: 'showWidget', url });
    unlock(wall._id, (err) => {
      if (err) {
        notifier.error(err);
      } else {
        getContent({});
        notifier.success('Thanks for unlocking your free content!');
      }
    });
  },

  generateLead() {
    const wall = getCurrentWall();
    const url = getCurrentUrl();
    if (!wall) { return; }

    sendCommand({ name: 'showWidget', url });
    generateLead(wall._id, (err) => {
      if (err) {
        notifier.error(err);
      } else {
        getContent({});
        notifier.success('Thank you!');
      }
    });
  },

  pay() {
    const wall = getCurrentWall();
    const url = getCurrentUrl();
    if (!wall) { return; }

    sendCommand({ name: 'showWidget', url });
    buy(wall._id, (err) => {
      if (err) {
        if (err.error === 'card-required') {
          FlowRouter.go('/card-info');
        }
        notifier.error(err);
      } else {
        const amount = wall.price || 25;
        getContent({});
        notifier.success(`Charged $${amount / 100}. Thank you.`);
      }
    });
  },

  buyDailyAccess() {
    const wall = getCurrentWall();
    const product = getCurrentProduct();
    const url = getCurrentUrl();
    if (!wall) { return; }

    sendCommand({ name: 'showWidget', url });
    Meteor.call('dailyAccess.buy', { wallId: wall._id }, (err) => {
      if (err) {
        if (err.error === 'card-required') {
          FlowRouter.go('/card-info');
        }
        notifier.error(err);
      } else {
        const { dailyAccessConfig: { price } } = product;
        getContent({});
        notifier.success(`Charged $${(price / 100).toFixed(2)}. Thank you.`);
      }
    });
  },

  buyPlan() {
    const wall = getCurrentWall();
    const url = getCurrentUrl();
    if (!wall) { return; }

    sendCommand({ name: 'showWidget', url });
    const plan = wall.getSinglePaymentPlan();
    if (!plan) {
      notifier.error('There is no section to buy on this page');
      return;
    }

    Meteor.call('products.buyPlan', { wallId: wall._id, planId: plan._id }, (err) => {
      if (err) {
        if (err.error === 'card-required') {
          FlowRouter.go('/card-info');
        }
        notifier.error(err);
      } else {
        getContent({});
        notifier.success(`Charged $${(plan.price / 100).toFixed(2)}. Thank you.`);
      }
    });
  },

  clickedOnUpsellingLink(data) {
    const wall = getCurrentWall();
    if (!wall) { return; }

    Meteor.call('contentWalls.clickedOnUpsellingLink', { wallId: wall._id, url: data.url }, (err) => {
      console.log(err);
    });
  },

  upvote() {
    const wall = getCurrentWall();
    if (!wall) { return; }

    const url = getCurrentUrl();
    sendCommand({ name: 'showWidget', url });
    upvote(wall._id, (err) => {
      if (err) {
        notifier.error(err);
      } else {
        notifier.success('Success! Thanks for recommending.');
      }
    });
  },

  readLater() {
    const wall = getCurrentWall();
    if (!wall) { return; }

    const url = getCurrentUrl();
    sendCommand({ name: 'showWidget', url });
    readLater(wall._id, (err) => {
      if (err) {
        notifier.error(err);
      } else {
        notifier.success('Saved. Thank you.');
      }
    });
  },


  subscribe() {
    if (Meteor.userId()) {
      FlowRouter.go('/');
    } else {
      notifier.error('Login required');
    }
  },

  updateCardInfo() {
    const url = getCurrentUrl();
    sendCommand({ name: 'showWidget', url });
    if (Meteor.userId()) {
      FlowRouter.go('/card-info?updateCard=1');
    } else {
      notifier.error('Login required');
    }
  },


  viewport(data) {
    viewportVar.set(data.viewport);
  },

  loginWithToken(data) {
    if (data && data.loginToken) {
      Accounts.loginWithToken(data.loginToken, (err) => {
        // TODO: Send log the data to some service.
        console.log(err);
      });
    }
  },

  signUp(data) {
    store.dispatch(registerAction({
      ...data.options,
      promoCode: store.getState().user.promoCode,
    }));
  },

  loginWithFacebook() {
    const promoCode = store.getState().user.promoCode;
    store.dispatch(loginWithFacebookAction(promoCode));
  },

  login(data) {
    store.dispatch(loginAction(data.options));
  },

  recoverPassword(data) {
    store.dispatch(recoverPasswordAction({ email: data.email }));
  },

  togglePromocodeForm() {
    showPromoCodeForm.set(!showPromoCodeForm.get());
  },

  toggleLoginForm() {
    showLoginForm.set(!showLoginForm.get());
  },

  showFooterBar() {
    showFooterBar.set(true);
  },

  hideFooterBar() {
    showFooterBar.set(false);
  },

  toggleRecoverPasswordForm() {
    showRecoverPasswordForm.set(!showRecoverPasswordForm.get());
  },

  addPromoCode(data) {
    store.dispatch(addPromoCodeAction(data.promoCode));
    this.togglePromocodeForm();
  },

  showNotification(data) {
    const fn = notifier[data.level];
    if (fn) {
      fn(data.text);
    }
  },
};

function receiveMessage(event) {
  const url = getCurrentUrl();
  const origin = event.origin || event.originalEvent.origin;

  if (!url || !url.startsWith(origin)) { return; }

  const { command } = event.data;
  if (command && commands[command]) {
    commands[command](event.data);
  }
}


function init() {
  window.addEventListener('message', receiveMessage, false);

  renderWidget();
  renderUpsellContent();
}

init();

store.subscribe(() => {
  if (!wallProps) {
    return;
  }

  const { wall } = wallProps;

  if (!wall) {
    return;
  }
  // Render paywall again if store changes
  const rendered = renderMarkup(
    <Paywall
      {...wallProps}
      userStore={store.getState().user}
    />
  );

  const product = getCurrentProduct();
  sendCommand({
    name: 'renderWall',
    url: getCurrentUrl(),
    data: {
      html: rendered.html,
      isClientSide: product && product.isClientSide,
      isPaid: wallProps.paid,
    },
  });
});
