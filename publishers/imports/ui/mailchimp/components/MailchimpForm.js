import React, { PropTypes } from 'react';
import {
  ConfigurationBox,
  ConfigurationInput,
  SubmitButton,
} from '/imports/ui/components';

const MailchimpForm = ({ onSubmit, listId, apiKey }) => (
  <ConfigurationBox
    title={'Mailchimp Integration'}
    collapsed
  >
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          listId: event.target.listId.value,
          apiKey: event.target.apiKey.value,
        });
      }}
    >
      <ConfigurationInput
        name="List ID"
        inputName={'listId'}
        isForm={false}
        value={listId}
      />

      <ConfigurationInput
        name="API KEY"
        inputName={'apiKey'}
        isForm={false}
        value={apiKey}
      />

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <SubmitButton
          btnStyle={'warning'}
          btnSize={'small'}
          label={'Save'}
        />
      </div>

    </form>
  </ConfigurationBox>
  );

MailchimpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  apiKey: PropTypes.string,
  listId: PropTypes.string,
};

export default MailchimpForm;
