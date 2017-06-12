import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { ConfigurationToggle } from '/imports/ui/components';
import { toggleLeadGeneration } from '../actions';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    name: 'Lead Generation',
    toggled: wall.leadGeneration,
    helpElement: (
      <span>
        Learn more about&nbsp;
        <a
          target="blank"
          href="http://publishers.getdrizzle.com/article/100-how-can-i-use-drizzle-for-lead-generation"
        >
          lead Generation
        </a>
      </span>
    ),
    onToggle: (toggled) => {
      toggleLeadGeneration({
        wallId: wall._id,
        state: toggled,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationToggle);
