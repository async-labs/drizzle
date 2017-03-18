import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { error, success } from '../../../notifier/' ;

import Card from '../components/Card';
import { addCard } from '../actions';

function composer(props, onData) {
  const user = Meteor.user();
  const card = user && user.stripeCustomer && user.stripeCustomer.card || null;

  onData(null, {
    card,
    isEmailVerified: user.isEmailVerified(),
    onSubmit: (event, onDone) => {
      event.preventDefault();

      const expDate = event.target.expirationDate.value.trim();
      const data = {
        number: event.target.number.value.trim(),
        name: event.target.name.value.trim(),
        cvc: event.target.cvc.value.trim(),
        exp_month: expDate.split('/')[0],
        exp_year: expDate.split('/')[1],
      };

      if (!data.number || !data.name || !data.cvc || !data.exp_month || !data.exp_year) {
        error('Please fill all fields!');
        return;
      }

      addCard(data, (err) => {
        if (err) {
          error(err);
          return;
        }

        success('Succefully added!');

        if (onDone) {
          onDone();
        }
      });
    },
  });
}

export default composeWithTracker(composer)(Card);
