import React, { PropTypes } from 'react';

import { ConfigurationToggle } from '/imports/ui/components';

const SubscribeModal = ({ onToggle, toggled }) => (
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="modal-title">Grant this user a free access to the content?</p>
      </div>

      <div className="modal-body">
        <ConfigurationToggle
          name="Grant free access"
          toggled={toggled}
          onToggle={onToggle}
        />
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-default"
          data-dismiss="modal"
        >Close</button>
      </div>
    </div>
  </div>
);

SubscribeModal.propTypes = {
  onToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default SubscribeModal;
