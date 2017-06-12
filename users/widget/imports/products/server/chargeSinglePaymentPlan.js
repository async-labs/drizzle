import { Meteor } from 'meteor/meteor';
import { chargeUser } from 'meteor/drizzle:charge-functions';
import { addTotalSpent } from 'meteor/drizzle:user-functions';
import { Products, Plans, ContentWallCharges } from 'meteor/drizzle:models';

import { userAlreadyPaidPAYG, createCharge } from './index';

export default function chargeSinglePaymentPlan({ user, vendor, product, wall, plan }) {
  if (product.disabled) {
    throw new Meteor.Error('invalid-data', 'Membership is not available. Contact owner of the website.');
  }

  if (plan.type !== 'singlePayment') {
    throw new Meteor.Error('invalid-data', 'Plan is not single payment type');
  }

  const amount = plan.price;

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
    planId: plan._id,
    createdAt: new Date(),
    url: wall.url,
    amount,
    amountToCharge,
    title: wall.title,
  };

  if (amountToCharge === 0) {
    obj.paid = true;
  }

  const chargeId = createCharge(obj);

  if (!wall.demo || !Meteor.settings.public.stripe.production) {
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

  Plans.update(plan._id, { $inc: { soldCount: 1, totalIncome: amount } });

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

      Plans.update(plan._id,
        { $inc: { soldCount: -1, totalIncome: -amount } });

      addTotalSpent(
        { userId: user._id, productId: product._id },
        { amount: -amount }
      );
    }, 30 * 1000);
  }
}
