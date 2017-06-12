Package.describe({summary: 'Single sign-on package for Zen Market'});

Package.onUse(function(api) {
  api.use([
    'templating',
    'kadira:flow-router',
    'kadira:blaze-layout'
  ], 'client');

  api.addFiles([
    'client/shared_auth_frame.html',
    'client/shared_auth_frame.js',
    'client/request_auth.js',
    'client/router.js'
  ], 'client');
});
