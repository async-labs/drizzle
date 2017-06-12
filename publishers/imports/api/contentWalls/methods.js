import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import {
  Products,
  Plans,
  ContentWalls,
  Categories,
} from 'meteor/drizzle:models';

export const toggleLeadGeneration = new ValidatedMethod({
  name: 'contentWalls.toggleLeadGeneration',
  validate({ wallId, state }) {
    check(wallId, String);
    check(state, Boolean);
  },

  run({ wallId, state }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (state) {
      ContentWalls.update(wallId, { $set: {
        leadGeneration: true,
      } });
    } else {
      ContentWalls.update(wallId, { $unset: {
        leadGeneration: 1,
      } });
    }
  },
});

export const toggleDailyAccess = new ValidatedMethod({
  name: 'contentWalls.toggleDailyAccess',
  validate({ wallId, isEnabled }) {
    check(wallId, String);
    check(isEnabled, Boolean);
  },

  run({ wallId, isEnabled }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: {
      isDailyAccessEnabled: isEnabled,
    } });
  },
});

export const toggleUpselling = new ValidatedMethod({
  name: 'contentWalls.toggleUpselling',
  validate({ wallId, isHidden }) {
    check(wallId, String);
    check(isHidden, Boolean);
  },

  run({ wallId, isHidden }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: {
      hideUpsellingList: isHidden,
    } });
  },
});

export const toggleMicropayment = new ValidatedMethod({
  name: 'contentWalls.toggleMicropayment',
  validate({ wallId, state }) {
    check(wallId, String);
    check(state, Boolean);
  },

  run({ wallId, state }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (state) {
      ContentWalls.update(wallId, { $set: {
        disableMicropayment: true,
      } });
    } else {
      ContentWalls.update(wallId, { $unset: {
        disableMicropayment: 1,
      } });
    }
  },
});

export const toggleMeteredPaywall = new ValidatedMethod({
  name: 'contentWalls.toggleMeteredPaywall',
  validate({ wallId, state }) {
    check(wallId, String);
    check(state, Boolean);
  },

  run({ wallId, state }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (state) {
      ContentWalls.update(wallId, { $set: {
        disableMeteredPaywall: true,
      } });
    } else {
      ContentWalls.update(wallId, { $set: {
        disableMeteredPaywall: false,
      } });
    }
  },
});

export const changePlan = new ValidatedMethod({
  name: 'contentWalls.changePlan',
  validate: new SimpleSchema({
    wallId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    planId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  }).validator(),

  run({ wallId, planId }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const plan = Plans.findOne(planId);

    if (!plan) {
      ContentWalls.update(wallId, { $unset: { subscriptionPlanIds: 1 } });
    } else {
      ContentWalls.update(wallId, { $set: { subscriptionPlanIds: [plan._id] } });
    }
  },
});

export const changeCategory = new ValidatedMethod({
  name: 'contentWalls.changeCategory',
  validate: new SimpleSchema({
    wallId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    categoryIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),

  run({ wallId, categoryIds }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const verifiedIds = Categories.find({
      _id: { $in: categoryIds } },
      { fields: { _id: 1 } }
    ).map(p => p._id);

    if (verifiedIds.length === 0) {
      ContentWalls.update(wallId, { $unset: { categoryIds: 1 } });
    } else {
      ContentWalls.update(wallId, { $set: { categoryIds: verifiedIds } });
    }
  },
});

export const configExpiration = new ValidatedMethod({
  name: 'contentWalls.configExpiration',
  validate: new SimpleSchema({
    wallId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    numberOfdays: {
      type: Number,
    },
    expirationEnabled: {
      type: Boolean,
    },
  }).validator(),

  run({ wallId, expirationEnabled, numberOfdays }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const expirationHours = (numberOfdays || 0) * 24;
    ContentWalls.update(wallId, { $set: { expirationHours, expirationEnabled } });
  },
});

export const configGuestButtonText = new ValidatedMethod({
  name: 'contentWalls.configGuestButtonText',
  validate: new SimpleSchema({
    wallId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    guestButtonText: {
      type: String,
    },
  }).validator(),

  run({ wallId, guestButtonText }) {
    if (guestButtonText && guestButtonText.length > 25) {
      throw new Meteor.Error('invalid-data', 'Text can not be longer than 25 characters');
    }

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { guestButtonText } });
  },
});

export const configDonation = new ValidatedMethod({
  name: 'contentWalls.configDonation',
  validate: new SimpleSchema({
    wallId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    donationEnabled: {
      type: Boolean,
    },
    donationMessage: {
      type: String,
    },
    donationThankYouMessage: {
      type: String,
    },
  }).validator(),

  run({ wallId, donationEnabled, donationMessage, donationThankYouMessage }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId,
      { $set: { donationEnabled, donationMessage, donationThankYouMessage } });
  },
});

export const saveCategory = new ValidatedMethod({
  name: 'contentWalls.saveCategory',
  validate: new SimpleSchema({
    productId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    name: {
      type: String,
    },
  }).validator(),

  run({ productId, id, name }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (id) {
      const category = Categories.findOne(id);
      if (!category) {
        throw new Meteor.Error('invalid-data', 'Category not found');
      }

      const data = { name };

      Categories.update(id, { $set: data });
    } else {
      if (Categories.findOne({ productId, name })) {
        throw new Meteor.Error('invalid-data', 'This category is already exists!');
      }

      Categories.insert({ productId, name, createdAt: new Date() });
    }
  },
});

export const removeCategory = new ValidatedMethod({
  name: 'contentWalls.removeCategory',
  validate: new SimpleSchema({
    id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),

  run({ id }) {
    const category = Categories.findOne(id);
    if (!category) {
      throw new Meteor.Error('invalid-data', 'Category not found');
    }

    const product = Products.findOne(category.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (ContentWalls.find({ categoryIds: id }).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an wall in this category. So you can not delete.'
      );
    }

    Categories.remove(id);
  },
});
