import { Meteor } from 'meteor/meteor';
import { MailChimp } from 'meteor/miro:mailchimp';
import { _ } from 'meteor/underscore';


export function addToList({ product, user }) {
  if (!user.emails || user.emails.length === 0) {
    return;
  }

  if (!product || !product.mailchimpConfig) {
    return;
  }

  const { apiKey, listId } = product.mailchimpConfig;
  const email = user.emails[0].address;

  if (apiKey && listId) {
    const profile = user.profile || {};

    const opts = {
      id: listId,
      email: { email },
      double_optin: false,
      merge_vars: {
      },
    };

    if (profile.name || profile.firstName) {
      opts.merge_vars.FNAME = profile.firstName || profile.name;
    }

    if (profile.lastName) {
      opts.merge_vars.LNAME = profile.lastName;
    }

    try {
      const api = new MailChimp(apiKey);
      api.call('lists', 'subscribe', opts);
    } catch (error) {
      throw new Meteor.Error('subscription-failed', error.message);
    }
  }
}

export function batchSubscribe({ product, users }) {
  if (!product || !product.mailchimpConfig) {
    return;
  }

  const { apiKey, listId } = product.mailchimpConfig;

  if (apiKey && listId) {
    const batch = users.map(user => {
      if (!user.emails || user.emails.length === 0) {
        return null;
      }

      const email = {
        email: user.emails[0].address,
        euid: user._id,
      };

      const opts = {
        email,
        merge_vars: {},
      };

      const profile = user.profile || {};

      if (profile.name || profile.firstName) {
        opts.merge_vars.FNAME = profile.firstName || profile.name;
      }

      if (profile.lastName) {
        opts.merge_vars.LNAME = profile.lastName;
      }

      return opts;
    });


    const opts = {
      id: listId,
      batch: _.filter(batch, item => !!item),
      double_optin: false,
    };

    try {
      const api = new MailChimp(apiKey);
      api.call('lists', 'batch-subscribe', opts);
    } catch (error) {
      throw new Meteor.Error('subscription-failed', error.message);
    }
  }
}
