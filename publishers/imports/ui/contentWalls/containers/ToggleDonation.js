import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import ToggleDonation from '../components/ToggleDonation.jsx';
import {
  configDonation,
} from '../actions';

function composer(props, onData) {
  if (!Meteor.userId()) { return; }

  const wall = props.wall;

  onData(null, {
    wall,
    configDonation,
  });
}

export default composeWithTracker(composer)(ToggleDonation);
