Package.describe({
  name: 'drizzle:user-functions',
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
    'http',
    'random',
    'underscore',
    'drizzle:models',
    'drizzle:integrations',
  ];

  api.use(deps);
  api.mainModule('server/index.js', 'server');
});

Npm.depends({
  moment: '2.14.1',
});
