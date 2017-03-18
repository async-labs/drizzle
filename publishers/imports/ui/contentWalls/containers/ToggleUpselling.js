import { composeWithTracker } from 'react-komposer';
import { toggleUpselling } from '../actions';
import { ConfigurationToggle } from '/imports/ui/components';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    name: 'Upselling lists',
    toggled: !wall.hideUpsellingList,
    onToggle: (toggled) => toggleUpselling({
      wallId: wall._id,
      isHidden: !toggled,
    }),
  });
}

export default composeWithTracker(composer)(ConfigurationToggle);
