Package.describe({
  name: 'drizzle:models',
  version: '0.0.1',
  summary: 'Core modules for Drizzle Apps',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');

  const deps = [
    'ecmascript',
    'mongo',
    'underscore',
    'modules',
    'accounts-password',
  ];

  const thirdyPartyDeps = [
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.10.0',
    'dburles:collection-helpers@1.0.4',
    'alanning:roles@1.2.15',
  ];

  api.use(deps);
  api.imply(deps);

  api.use(thirdyPartyDeps);
  api.imply(thirdyPartyDeps);

  api.mainModule('index.js');
});
