import React, { PropTypes } from 'react';


const Switch = ({ selected, onChange, id, label=true, ...props }) => (
  <div data-am-toggle-switch className="center margin-5">
    { label ? <span>Yes</span> : '' }
    <input id={id}
      type="checkbox"
      onChange={onChange}
      checked={selected} {...props}/>
    <label htmlFor={id}></label>
    { label ? <span>No</span> : '' }
  </div>
);

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  label: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default Switch;
