import { composeWithTracker } from 'react-komposer';
import { toggleViewportConfig } from '../actions';

import ToggleViewportConfig from '../components/ToggleViewportConfig';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    toggled: !(wall.viewportConfig && wall.viewportConfig.disabled),
    value: wall.viewportConfig && wall.viewportConfig.width || 360,
    onToggle: (toggled) => {
      toggleViewportConfig({
        wallId: wall._id,
        state: !toggled,
        width: wall.viewporConfig && wall.viewportConfig.width || 360,
      });
    },
    onSubmit: ({ toggled, width }) => {
      toggleViewportConfig({
        wallId: wall._id,
        state: !toggled,
        width: parseInt(width) || 360,
      });
    },
  });
}

export default composeWithTracker(composer)(ToggleViewportConfig);
