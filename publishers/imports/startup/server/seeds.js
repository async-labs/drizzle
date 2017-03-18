import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Roles } from 'meteor/alanning:roles';

import { Products, ContentWalls } from 'meteor/drizzle:models';

Meteor.startup(() => {
  // creating initial admin user
  const user = Meteor.users.findOne({ 'emails.address': 'admin@example.com' });
  let userId;

  if (!user) {
    userId = Accounts.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });
  } else {
    userId = user._id;
  }

  Roles.addUsersToRoles(userId, ['admin']);

  const createdAt = new Date();
  const obj = {
    url: 'http://localhost:8060',
    domain: 'localhost:8060',
    vendorUserId: userId,
    claimStatus: 'verified',
    createdAt,
    numberVisitors: 10,
    description: 'Example website',
    title: 'Example website',
  };

  const product = Products.findOne({ domain: obj.domain });
  let productId;

  if (!product) {
    productId = Products.insert(obj);
  } else {
    productId = product._id;
  }

  const fullUrl = 'localhost:8060/';
  if (!ContentWalls.findOne({ url: fullUrl })) {
    const wall = {
      url: fullUrl,
      price: 25,
      productId,
      createdAt,
      sellCount: 0,
      totalIncome: 0,
      score: 0,
      title: 'Example page',
      description: 'description',
      content: {
        original: 'Hidden content',
      },
    };

    ContentWalls.insert(wall);
  }
});
