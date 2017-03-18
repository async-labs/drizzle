import { composeWithTracker } from 'react-komposer';
import { ConfigurationInput } from '/imports/ui/components';
import { configGuestButtonText } from '../actions';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    name: 'Call-to-action text for guest users',
    value: wall.guestButtonText || 'Read More',
    nameStyle: { fontWeight: 700 },
    onSubmit: (value) => {
      configGuestButtonText({
        wallId: wall._id,
        guestButtonText: value,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationInput);
