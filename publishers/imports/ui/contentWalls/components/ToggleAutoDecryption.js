import React, { PropTypes } from 'react';
import {
  ConfigurationToggle,
  ConfigurationInput,
  SubmitButton,
} from '/imports/ui/components';

const ToggleAutoDecryption = ({ onSubmit, onToggle, toggled, cpm, viewCountLimit }) => (
  <ConfigurationToggle
    name="Automatic Paywall Removal"
    toggled={toggled}
    onToggle={onToggle}
  >
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          cpm: Number(event.target.cpm.value),
          viewCountLimit: Number(event.target.viewCountLimit.value),
        });
      }}
    >
      <ConfigurationInput
        value={cpm}
        name="CPM"
        inputName={'cpm'}
        isForm={false}
        options={[{
          label: '$1',
          value: '1',
        }, {
          label: '$2',
          value: '2',
        }, {
          label: '$3',
          value: '3',
        }, {
          label: '$4',
          value: '4',
        }, {
          label: '$5',
          value: '5',
        }]}
      />

      <ConfigurationInput
        value={viewCountLimit}
        name="Number of views for experiment to run"
        inputName={'viewCountLimit'}
        isForm={false}
        options={[{
          label: '1000',
          value: '1000',
        }, {
          label: '2000',
          value: '2000',
        }, {
          label: '3000',
          value: '3000',
        }, {
          label: '4000',
          value: '4000',
        }, {
          label: '5000',
          value: '5000',
        }]}
      />

      <div style={{ marginTop: 20, width: '100%', textAlign: 'right' }}>
        <SubmitButton
          label={'Save'}
          btnSize={'small'}
          btnStyle={'warning'}
        />
      </div>

    </form>

  </ConfigurationToggle>
);

ToggleAutoDecryption.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
  cpm: PropTypes.number,
  viewCountLimit: PropTypes.number,
};

export default ToggleAutoDecryption;
