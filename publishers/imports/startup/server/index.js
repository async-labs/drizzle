import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Migrations } from 'meteor/percolate:migrations';

// Set up some rate limiting and other important security settings.
import './security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';

SyncedCron.start();

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
