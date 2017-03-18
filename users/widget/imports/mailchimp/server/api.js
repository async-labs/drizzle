import { Meteor } from 'meteor/meteor';
import { MailChimp } from 'meteor/miro:mailchimp';


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
