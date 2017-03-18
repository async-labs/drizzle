import { composeWithTracker } from 'react-komposer';
import { configExpiration } from '../actions';
import ToggleExpiration from '../components/ToggleExpiration.jsx';

const resolveNumberOfDays = (expirationHours) =>
  expirationHours && expirationHours / 24 || 0;

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    toggled: wall.expirationEnabled,
    numberOfdays: resolveNumberOfDays(wall.expirationHours),
    onToggle: (toggled) => configExpiration({
      wallId: wall._id,
      expirationEnabled: toggled,
      numberOfdays: resolveNumberOfDays(wall.expirationHours),
    }),
    onSubmit: ({ numberOfdays, expirationEnabled }) => configExpiration({
      wallId: wall._id,
      numberOfdays,
      expirationEnabled,
    }),
  });
}

export default composeWithTracker(composer)(ToggleExpiration);
