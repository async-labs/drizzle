import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.urls.verifyEmail = (token) => Meteor.absoluteUrl(`auth/verify/${token}`);

Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`auth/recover-password/${token}`);


Accounts.emailTemplates.siteName = 'Drizzle';
Accounts.emailTemplates.from = 'Drizzle <support@getdrizzle.com>';

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

Accounts.config({
  sendVerificationEmail: false,
});
