import '../imports/communicateWithWidget/client/script.js';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { StyleSheet } from 'aphrodite';

// disabling HISTORY API, so we can go back to previous page
FlowRouter._page.Context.prototype.pushState = () => {}; // eslint-disable-line

import '../imports/client/routes.jsx';

StyleSheet.rehydrate(window.renderedClasses);
