import React, { PropTypes } from 'react';

import Toggle from 'react-toggle';

const ToggleUpselling = ({ isEnabled, onToggle }) => (
  <div style={{ backgroundColor: '#f9f9f9' }}>
    <h3 className="text-center pad20">Upselling lists</h3>
    <table className="margin-auto">
      <tbody>
        <tr>
          <td>No</td>
          <td className="text-center">
            <Toggle
              defaultChecked={isEnabled}
              onChange={onToggle}
            />
          </td>
          <td>Yes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

ToggleUpselling.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ToggleUpselling;
