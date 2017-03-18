Package.describe({
  name: 'drizzle:check-functions',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use(['ecmascript']);

  const deps = [
    'http',
    'drizzle:models',
  ];

  api.use(deps);
  api.imply(deps);

  api.mainModule('index.client.js', 'client');
  api.mainModule('index.server.js', 'server');
});

Npm.depends({
  cheerio: '0.19.0',
});
