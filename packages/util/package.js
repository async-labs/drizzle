Package.describe({
  name: 'drizzle:util',
  version: '0.0.1',
  summary: 'Utilities module',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use([
    'ecmascript',
    'underscore',
    'http',
    'modules',
    'drizzle:models',
  ]);

  api.mainModule('index.js', 'client');
  api.mainModule('server/index.js', 'server');
});

Npm.depends({
  url: '0.10.3',
});
