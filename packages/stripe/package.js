Package.describe({
  name: 'drizzle:stripe',
  version: '0.0.1',
  summary: 'Stripe intergration module',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'underscore',
    'check',
    'accounts-base',

    'drizzle:models',
  ]);

  api.imply([
    'accounts-base',
  ]);

  api.mainModule('server/index.js', 'server');
});

Npm.depends({
  stripe: '4.9.0',
});
