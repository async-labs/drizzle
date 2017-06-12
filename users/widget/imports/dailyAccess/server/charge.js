import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { chargeDailyAccess } from 'meteor/drizzle:charge-functions';
import { boughtDailyAccess } from 'meteor/drizzle:user-functions';
import { Subscriptions, Products, DailyAccessCharges, ContentWalls } from 'meteor/drizzle:models';

function isUserHaveActiveAccess(userId, productId) {
  const now = new Date();

  return DailyAccessCharges.find({
    productId,
    userId,
    endAt: { $gte: now },
    beginAt: { $lte: now },
  }).count() > 0;
}

export default function charge({ user, vendor, product, wall }) {
  if (product.disabled) {
    throw new Meteor.Error('invalid-data', 'Membership is not available. Contact owner of the website.');
  }

  if (!product.isDailyAccessEnabled()) {
    throw new Meteor.Error('invalid-data', 'Daily access in not enabled on this website');
  }

  if (isUserHaveActiveAccess(user._id, product._id)) {
    throw new Meteor.Error('invalid-data', 'You have already paid.');
  }

  if (user._id === vendor._id) {
    throw new Meteor.Error('invalid-data', 'You are this product\'s owner.');
  }

  const now = new Date();
  const subscription = Subscriptions.findOne({
    userId: user._id,
    productId: product._id,
    planId: { $exists: false },
    beginAt: { $lte: now },
    endAt: { $gte: now },
  }, {
    fields: { _id: 1 },
  });

  if (subscription) {
    throw new Meteor.Error('invalid-data', 'You have already subscribed.');
  }

  const { dailyAccessConfig: { price: amount } } = product;

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

  const obj = {
    userId: user._id,
    productId: product._id,
    vendorId: vendor._id,
    wallId: wall._id,
    createdAt: now,
    beginAt: now,
    endAt: moment(now).add(24, 'h')._d,
    amount,
    amountToCharge,
  };

  if (amountToCharge === 0) {
    obj.paid = true;
  }

  const chargeId = DailyAccessCharges.insert(obj);

  if ((!wall.demo || !Meteor.settings.public.stripe.production) && amountToCharge > 0) {
    try {
      chargeDailyAccess({ user, id: chargeId });
    } catch (ex) {
      DailyAccessCharges.remove(chargeId);

      throw ex;
    }
  }

  Meteor.users.update(user._id, {
    $set: { depositBalance },
  });

  Meteor.users.update(vendor._id, {
    $inc: {
      incomeBalance: amount, incomeCurrentBalance: amount,
      dailyAccessBalance: amount, dailyAccessCurrentBalance: amount,
    },
  });

  ContentWalls.update(wall._id, {
    $inc: {
      dailyAccessSoldCount: 1,
    },
  });

  Products.update(product._id, {
    $inc: {
      totalIncome: amount,
      dailyAccessIncome: amount,
    },
  });

  boughtDailyAccess({ userId: user._id, productId: product._id });

  if (wall.demo) {
    Meteor.setTimeout(function setTimeout() { // eslint-disable-line
      DailyAccessCharges.remove(chargeId);

      Meteor.users.update(vendor._id, { $inc: {
        incomeBalance: -amount, incomeCurrentBalance: -amount,
        dailyAccessBalance: -amount, dailyAccessCurrentBalance: -amount,
      } });

      Products.update(product._id, {
        $inc: {
          totalIncome: -amount,
          dailyAccessIncome: -amount,
        },
      });

      ContentWalls.update(wall._id, {
        $inc: {
          dailyAccessSoldCount: -1,
        },
      });
    }, 30 * 1000);
  }
}
