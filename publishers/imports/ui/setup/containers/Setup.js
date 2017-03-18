import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import { error } from '/imports/ui/notifier';
import { currentProduct } from '../../products/currentProduct';

import Setup from '../components/Setup.jsx';

const drizzleScriptVar = new ReactiveVar(undefined);

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const drizzleScript = drizzleScriptVar.get();

  if (drizzleScript === undefined) {
    drizzleScriptVar.set(null);
    Meteor.call('products.getWidgetJS', { productId: product._id }, (err, script) => {
      if (err) {
        console.log(err);
        error(err);
      } else {
        drizzleScriptVar.set(script);
      }
    });
  }

  if (drizzleScript === undefined || drizzleScript === null) {
    return;
  }

  onData(null, { product, drizzleScript });
}

export default composeWithTracker(composer)(Setup);
