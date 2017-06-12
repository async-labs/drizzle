import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { chargeUser } from 'meteor/drizzle:charge-functions';

import {
  leadGeneration,
  removeProductUser,
  addTotalSpent,
  getFreeReadArticleCount,
  increaseFreeReadArticleCount,
} from 'meteor/drizzle:user-functions';

import {
  ProductUsers,
  Products,
  ContentWalls,
  ContentWallCharges,
} from 'meteor/drizzle:models';

export const createCharge = (charge) => {
  try {
    return ContentWallCharges.insert(charge);
  } catch (err) {
    if (err.code === 11000) {
      return console.log('Duplicated payg_charges not added.', charge);
    }
    throw err;
  }
};

export function userAlreadyPaidPAYG(userId, wallId) {
  return ContentWallCharges.find({
    wallId,
    userId,
    $or: [
      { expiredAt: { $exists: false } },
      { expiredAt: { $gt: new Date() } },
    ],
  }).count() > 0;
}

export function chargePAYG({ user, vendor, product, wall }) {
  if (product.disabled) {
    throw new Meteor.Error('invalid-data', 'Product is disabled');
  }

  if (!wall) {
    throw new Meteor.Error('invalid-data', 'Paywall not found');
  }

  if (!product) {
    throw new Meteor.Error('invalid-data', 'Product not found');
  }

  if (!product.paygEnabled || wall.disableMicropayment) {
    throw new Meteor.Error('invalid-data', 'Pay-per-content is not enabled.');
  }

  const amount = wall.price || product.PAYG_amount || 20; // default 20 cents

  let depositBalance = user.depositBalance || 0;

  let amountToCharge = amount - depositBalance;
  if (amountToCharge < 0) {
    amountToCharge = 0;
    depositBalance -= amount;
  } else {
    depositBalance = 0;
  }

  if (amountToCharge && !user.stripeCustomer) {
    throw new Meteor.Error(
      'card-required',
      'Please add your card info to continue using Drizzle.'
    );
  }

  if (user._id === vendor._id) {
    throw new Meteor.Error('invalid-data', 'You are this product\'s owner.');
  }

  if (userAlreadyPaidPAYG(user._id, wall._id)) {
    throw new Meteor.Error('invalid-data', 'You have already paid.');
  }

  const obj = {
    userId: user._id,
    productId: product._id,
    vendorId: vendor._id,
    wallId: wall._id,
    createdAt: new Date(),
    url: wall.url,
    amount,
    amountToCharge,
    title: wall.title,
  };

  if (amountToCharge === 0) {
    obj.paid = true;
  }

  if (wall.expirationEnabled && wall.expirationHours) {
    obj.expiredAt = moment().add(wall.expirationHours, 'h')._d;
  }

  const chargeId = createCharge(obj);

  if ((!wall.demo || !Meteor.settings.public.stripe.production) && amountToCharge >= 100) {
    try {
      chargeUser({ userId: user._id, chargeId });
    } catch (ex) {
      ContentWallCharges.remove(chargeId);

      throw ex;
    }
  } else {
    Meteor.users.update(user._id, {
      $inc: { walletBalance: -amountToCharge },
    });
  }

  Meteor.users.update(user._id, {
    $set: { depositBalance },
  });

  Meteor.users.update(vendor._id, {
    $inc: {
      incomeBalance: amount, incomeCurrentBalance: amount,
      paygBalance: amount, paygCurrentBalance: amount,
    },
  });

  Products.update(product._id, {
    $inc: {
      totalIncome: amount,
      paygIncome: amount,
    },
  });

  ContentWalls.update(wall._id,
    { $inc: { sellCount: 1, totalIncome: amount } });

  addTotalSpent(
    { userId: user._id, productId: product._id },
    { amount },
    { isMicropaid: true }
  );

  if (wall.demo) {
    Meteor.setTimeout(function setTimeout() { // eslint-disable-line
      ContentWallCharges.remove(chargeId);

      Meteor.users.update(user._id, { $inc: { walletBalance: amountToCharge } });

      Meteor.users.update(vendor._id, { $inc: {
        incomeBalance: -amount, incomeCurrentBalance: -amount,
        paygBalance: -amount, paygCurrentBalance: -amount,
      } });

      Products.update(product._id, {
        $inc: {
          totalIncome: -amount,
          paygIncome: -amount,
        },
      });

      ContentWalls.update(wall._id,
        { $inc: { sellCount: -1, totalIncome: -amount } });

      addTotalSpent(
        { userId: user._id, productId: product._id },
        { amount: -amount }
      );
    }, 30 * 1000);
  }
}

export function unlock({ user, vendor, product, wall }) {
  if (!wall || wall.disableMeteredPaywall) {
    throw new Meteor.Error('invalid-data', 'Unlock is not enabled.');
  }

  if (!user.isEmailVerified()) {
    throw new Meteor.Error('invalid-data', 'Email is not verified');
  }

  if (user._id === vendor._id) {
    throw new Meteor.Error('invalid-data', 'You are this product\'s owner.');
  }

  if (userAlreadyPaidPAYG(user._id, wall._id)) {
    throw new Meteor.Error('invalid-data', 'You have already paid.');
  }

  const freeArticleCount = product.freeArticleCount;

  if (!freeArticleCount) {
    throw new Meteor.Error('invalid-data', 'Metered paywall is not enabled.');
  }

  const userReadCount = getFreeReadArticleCount({ userId: user._id, productId: product._id });

  if (userReadCount >= freeArticleCount) {
    throw new Meteor.Error('invalid-data', 'You used all free unlocks this month.');
  }

  const chargeId = createCharge({
    userId: user._id,
    productId: product._id,
    vendorId: vendor._id,
    wallId: wall._id,
    createdAt: new Date(),
    url: wall.url,
    amount: 0,
    title: wall.title,
    free: true,
  });

  increaseFreeReadArticleCount({ userId: user._id, productId: product._id });

  if (wall.demo) {
    Meteor.setTimeout(function setTimeout() { // eslint-disable-line
      ContentWallCharges.remove(chargeId);

      const productUser = ProductUsers.findOne({ userId: user._id, productId: product._id });
      if (productUser) {
        ProductUsers.update(
          productUser._id,
          { $inc: { freeReadArticleCount: -1 } }
        );
      }
    }, 30 * 1000);
  }
}

export function generateLead({ user, vendor, product, wall }) {
  if (!wall) {
    throw new Meteor.Error('invalid-data', 'PAYG is not enabled.');
  }

  if (!wall.leadGeneration) {
    throw new Meteor.Error('invalid-data', 'Lead generation is not enabled!');
  }

  if (!user.isEmailVerified()) {
    throw new Meteor.Error('invalid-data', 'Email is not verified');
  }

  if (user._id === vendor._id) {
    throw new Meteor.Error('invalid-data', 'You are this product\'s owner.');
  }

  if (userAlreadyPaidPAYG(user._id, wall._id)) {
    throw new Meteor.Error('already-unlocked', 'You have already unlocked this content.');
  }

  const chargeId = createCharge({
    userId: user._id,
    productId: product._id,
    vendorId: vendor._id,
    wallId: wall._id,
    createdAt: new Date(),
    url: wall.url,
    amount: 0,
    title: wall.title,
    leadGeneration: true,
  });

  leadGeneration({ userId: user._id, productId: product._id });

  if (wall.demo) {
    Meteor.setTimeout(function setTimeout() { // eslint-disable-line
      ContentWallCharges.remove(chargeId);
      removeProductUser({ userId: user._id, productId: product._id });
    }, 30 * 1000);
  }
}

import './methods';
import './publications';
