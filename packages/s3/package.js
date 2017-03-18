Package.describe({
  name: 'drizzle:s3',
  version: '0.0.1',
  summary: 'S3 intergration module',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');
  api.use(['ecmascript']);
  api.use(['peerlibrary:aws-sdk']);
  api.mainModule('server/index.js', 'server');
});

Npm.depends({
  url: '0.10.3',
});
