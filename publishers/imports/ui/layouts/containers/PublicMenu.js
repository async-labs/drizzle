import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';

import PublicMenu from '../components/PublicMenu.jsx';

function composer(props, onData) {
  const setMenu = (event) => {
    FlowRouter.go(event.target.dataset.href);
  };

  onData(null, {
    setMenu,
    path: FlowRouter.current().route.path,
  });
}

export default composeWithTracker(composer)(PublicMenu);
