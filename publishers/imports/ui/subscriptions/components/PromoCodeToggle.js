import React, { PropTypes } from 'react';
import moment from 'moment';
import {
  ConfigurationInput,
  ConfigurationToggle,
  SubmitButton,
} from '/imports/ui/components';

const PromoCodeToggle = ({
  onToggle,
  onSubmit,
  toggled,
  discountConfig,
}) => (
  <ConfigurationToggle
    name="Discount code"
    toggled={toggled}
    onToggle={onToggle}
  >
    {discountConfig.promoCode && (
      <div>
        <p>If Free Trial is ON, discount code form is shown to "Cancelled Trial" and "Unsubscribed" users ONLY.</p>
        <p>If Free Trial is OFF, discount code form is shown to ALL users.</p>
        <p><b>Discount Code: </b>{discountConfig.promoCode}</p>
        <p><b>End at: </b>{moment(discountConfig.endAt).format('DD MMM YYYY')}</p>
        <hr />
      </div>
    )}

    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          discountPercent: event.target.discountPercent.value,
          activeDayCount: event.target.activeDayCount.value,
        });
      }}
    >
      <ConfigurationInput
        name="Discount for subscriber's first payment:"
        inputName={'discountPercent'}
        value={discountConfig.discountPercent}
        options={[
          { label: '10%', value: 10 },
          { label: '20%', value: 20 },
          { label: '30%', value: 30 },
          { label: '40%', value: 40 },
          { label: '50%', value: 50 },
          { label: '60%', value: 60 },
          { label: '70%', value: 70 },
          { label: '80%', value: 80 },
          { label: '90%', value: 90 },
          { label: '100%', value: 100 },
        ]}
        isForm={false}
      />

      <ConfigurationInput
        name="Number of active day:"
        inputName={'activeDayCount'}
        value={discountConfig.activeDayCount}
        isForm={false}
      />

      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <SubmitButton
          label={'Save'}
          btnStyle={'warning'}
          btnSize={'small'}
        />
      </div>
    </form>


  </ConfigurationToggle>
);

PromoCodeToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
  discountConfig: PropTypes.object,
};

PromoCodeToggle.defaultProps = {
  discountConfig: {},
};

export default PromoCodeToggle;
