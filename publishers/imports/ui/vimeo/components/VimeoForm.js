import React, { PropTypes } from 'react';
import {
  ConfigurationBox,
  Button,
} from '/imports/ui/components';

const VimeoForm = ({ isConnected, connect }) => (
  <ConfigurationBox
    title={'Vimeo'}
    collapsed
  >
    {isConnected
      ? <span style={{ color: 'green' }}>Connected to Vimeo</span>
      : <div style={{ textAlign: 'right', marginTop: 10 }}>
        <Button
          btnStyle={'warning'}
          btnSize={'small'}
          label={'Connect'}
          onClick={connect}
        />
      </div>}
  </ConfigurationBox>
  );

VimeoForm.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  connect: PropTypes.func.isRequired,
};

export default VimeoForm;
