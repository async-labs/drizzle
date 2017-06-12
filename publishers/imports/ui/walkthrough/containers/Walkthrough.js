import { composeWithTracker } from 'react-komposer';

import Walkthrough from '../components/Walkthrough.jsx';


const tooltip = [
  'Go to “Setup” and follow the instructions',
  'Go to "Metered Paywall" and config count',
  'Go to "Paywalls"',
  'Paste URL of the webpage and click "Add New Paywall" button',
];

function composer(props, onData) {
  onData(null, {
    text: tooltip[props.step - 1],
    hide: props.hide || false,
  });
}

export default composeWithTracker(composer)(Walkthrough);
