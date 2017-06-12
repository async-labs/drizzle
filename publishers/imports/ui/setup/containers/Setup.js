import 'whatwg-fetch';

import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';

// import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/kadira:flow-router';

import { currentProduct } from '../../products/currentProduct';

import Setup from '../components/Setup.jsx';

const drizzleScriptVar = new ReactiveVar(undefined);

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  /* Meteor.call('products.getWalkthroughStep', product._id, (err, step) => {
    if (step && step.path && step.path === FlowRouter.current().path) {
      onData(null, { product, isGuiding: true, checkStatus });
    }
  });*/

  const scriptUrl = 'https://s3-us-west-1.amazonaws.com/zenmarket/for-widget.js';
  const drizzleScript = drizzleScriptVar.get();

  if (drizzleScript === undefined) {
    drizzleScriptVar.set(null);
    fetch(scriptUrl)
      .then(response => response.text())
      .then((body) => {
        drizzleScriptVar.set(body);
      });
  }

  if (!drizzleScript) {
    return;
  }

  onData(null, { product, drizzleScript });
}

export default composeWithTracker(composer)(Setup);
