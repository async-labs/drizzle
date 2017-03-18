Package.describe({
  name: 'drizzle:charge-functions',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use(['ecmascript']);

  const deps = [
    'email',
    'underscore',
    'accounts-base',
    'drizzle:models',
    'drizzle:stripe',
  ];

  api.use(deps);
  api.imply(deps);
  api.mainModule('server/index.js', 'server');
});
