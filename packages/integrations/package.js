Package.describe({
  name: 'drizzle:integrations',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'http',
    'underscore',
    'aldeed:simple-schema',
    'miro:mailchimp',
  ]);

  api.mainModule('server/index.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('drizzle:integrations');
  api.mainModule('integrations-tests.js');
});
