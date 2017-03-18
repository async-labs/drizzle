import { _ } from 'meteor/underscore';

export default function sendCommand({ name, url, data }) {
  if (!url || !name) { return; }

  const command = _.extend({ command: name }, data);

  window.parent.postMessage(command, url);
}
