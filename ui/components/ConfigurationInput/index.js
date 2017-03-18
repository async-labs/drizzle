import React, { PropTypes } from 'react';
import { Input, SubmitButton, ConfigurationBox } from '../';
import ControlledValue from '../../enhancers/ControlledValue';

export const ControlledInput = ControlledValue(props =>
  <Input {...props} />
);

export const ControlledSelect = ControlledValue(({ options = [], ...props }) =>
  <select {...props}>
    <option>Select an option</option>
    {options.map(option => (
      <option
        key={option.value}
        value={option.value}
      >{option.label}
      </option>
    ))}
  </select>
);

// Renders <input> or <select> if options are provided
const renderInput = ({ name, inputName, value, options, placeholder, ...props }) => options ? (
  <ControlledSelect
    options={options}
    name={inputName}
    value={value}
    style={{
      height: 37,
      backgroundColor: 'white',
      flex: '0.1',
    }}
    {...props}
  />
) : (
  <ControlledInput
    name={inputName}
    value={value}
    placeholder={placeholder}
    {...props}
  />
);

const ConfigurationInput = ({
  onSubmit,
  name,
  nameStyle,
  inputName,
  value,
  placeholder,
  isForm,
  options,
  ...props,
  }) => (
  <ConfigurationBox
    collapsed
    title={name}
    titleStyle={{ fontWeight: 300, ...nameStyle }}
    elementRight={
      isForm ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(event.target[inputName].value);
          }}
        >
          {renderInput({ name, nameStyle, inputName, value, placeholder, options, ...props })}

          <SubmitButton
            label={'Save'}
            btnStyle={'warning'}
            btnSize={'small'}
            style={{
              marginLeft: 5,
              height: '29px !important',
            }}
          />
        </form>
      ) : renderInput({ name, nameStyle, inputName, value, placeholder, options, ...props })
    }
  />
);

ConfigurationInput.propTypes = {
  name: PropTypes.string.isRequired,
  nameStyle: PropTypes.object,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func,
  isForm: PropTypes.bool.isRequired,
  inputName: PropTypes.string,
};

ConfigurationInput.defaultProps = {
  inputName: 'config',
  isForm: true,
};

export default ConfigurationInput;
