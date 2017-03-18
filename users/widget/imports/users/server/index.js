import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

import { KeyValues } from 'meteor/drizzle:models';
import './methods';
import './publications';

const WELCOME_EMAIL_HTML = `<h3>Welcome to Drizzle</h3>
<p>Welcome to Drizzle!</p>
<p>Our mission is to help great makers to be rewarded for their great content.</p>
<p>Got question? Shoot us an email at support@getdrizzle.com</p>

<a href="https://getdrizzle.com">Drizzle</a>`;


Accounts.onCreateUser((options, newUser) => {
  const user = _.clone(newUser);
  user.profile = options.profile;
  user.walletBalance = 0;
  user.notifications = {
    weekly_popular_content: false,
  };
  if (user.services.facebook) {
    user.profile.name = user.services.facebook.name;
    user.profile.firstName = user.services.facebook.first_name;
    user.profile.lastName = user.services.facebook.last_name;
    user.emails = [{
      address: user.services.facebook.email,
      verified: true,
    }];
  }
  if (!options.profile || !options.profile.firstName || !options.profile.lastName) {
    throw new Meteor.Error('invalid-data', 'Name is required');
  }
  if (!user.profile.name) {
    user.profile.name = `${options.profile.firstName} ${options.profile.lastName}`;
  }

  const key = 'welcomeEmailForusers';

  let emailValue = KeyValues.findOne({ key }) || {};
  emailValue = emailValue && emailValue.value || {};

  const email = user && _.last(user.emails);

  if (email) {
    const emailObj = {
      from: 'Drizzle <support@getdrizzle.com>',
      subject: emailValue && emailValue.subject || 'Welcome to Drizzle',
      html: emailValue && emailValue.content || WELCOME_EMAIL_HTML,
      to: email.address,
    };

    Meteor.defer(() => {
      Email.send(emailObj);
    });
  }

  return user;
});

Accounts.urls.verifyEmail = (token) => `${Meteor.settings.PUBLISHER_ROOT_URL}/auth/verify/${token}`;

Accounts.onLogin((info) => {
  const email = info.user && _.last(info.user.emails);
  if (!email || email.verified) {
    return;
  }

  const verificationTokens = (info.user.services && info.user.services.email &&
    info.user.services.email.verificationTokens);

  const alreadySentEmail = _.some(verificationTokens, (token) => token.address === email.address);

  if (!alreadySentEmail) {
    Accounts.sendVerificationEmail(info.user._id);
  }
});


Accounts.emailTemplates.siteName = 'Drizzle';
Accounts.emailTemplates.from = 'Drizzle <support@getdrizzle.com>';
Accounts.emailTemplates.subject = 'How to verify email address on Drizzle';

Accounts.emailTemplates.resetPassword.html = (user, url) => {
  let html = `<p>Hello ${user.getFullName()}</p>`;

  html += '<p>To reset your password, simply click the link below.<p>';
  html += `<p><a href="${url}">Reset password</a></p>`;
  html += '<p>Thanks<p>';

  return html;
};

Accounts.emailTemplates.verifyEmail.html = (user, url) => {
  let html = `<p>Hello ${user.getFullName()}</p>`;

  html += '<p>To verify your account email, simply click the link below.<p>';
  html += `<p><a href="${url}">Verify email</a></p>`;
  html += '<p>Thanks<p>';

  return html;
};

Accounts.emailTemplates.resetPassword.text = () => null;
Accounts.emailTemplates.verifyEmail.text = () => null;

Accounts.urls.resetPassword = (token) => `${Meteor.settings.PUBLISHER_ROOT_URL}/auth/recover-password/${token}`;

Accounts.config({
  sendVerificationEmail: true,
});
