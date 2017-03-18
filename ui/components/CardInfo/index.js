import React, { PropTypes } from 'react';
import Input from '../Input';
import { FormGroup, ControlLabel } from 'react-bootstrap';

const styles = {
  ul: {
    listStyle: 'none',
  },
};

const CardInfo = ({ card, style }) => (
  <div style={style}>
    <FormGroup style={{ width: '70%', display: 'inline-block', paddingRight: '2px' }}>
      <ControlLabel> Number </ControlLabel>
      <Input
        defaultValue={`**** **** **** ${card.last4}`}
        fullWidth
        disabled
      />
    </FormGroup>
    <FormGroup style={{ width: '30%', display: 'inline-block', paddingLeft: '2px' }}>
      <ControlLabel> Expire </ControlLabel>
        <Input
          defaultValue={`${card.exp_month}/${card.exp_year.toString().substr(2, 4)}`}
          fullWidth
          disabled
        />
    </FormGroup>
  </div>
);

CardInfo.propTypes = {
  card: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default CardInfo;
