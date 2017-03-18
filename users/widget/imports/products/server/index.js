import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { chargeUser } from 'meteor/drizzle:charge-functions';

import {
  addTotalSpent,
} from 'meteor/drizzle:user-functions';

import {
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

import './methods';
import './publications';
