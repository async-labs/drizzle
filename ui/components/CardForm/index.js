import React, { Component, PropTypes } from 'react';
import { Input, Button, CreditCardIcon } from '../';
import Payment from 'payment';

const styles = {
  expirationDateInput: {
    width: '48%',
    display: 'inline-block',
    marginRight: '2%',
  },
  cvcInput: {
    width: '48%',
    display: 'inline-block',
    marginLeft: '2%',
  },
  input: {
    marginBottom: 15,
  },
  form: {
    position: 'relative',
  },
};

class CardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: '',
      type: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onNumberChange(event) {
    const number = Payment.fns.formatCardNumber(event.target.value);
    const type = Payment.fns.cardType(number);
    this.setState({ number, type });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(event);
  }

  render() {
    const { style } = this.props;
    return (
      <form
        onSubmit={this.handleSubmit}
        style={{
          ...styles.form,
          ...style,
        }}
        autoComplete
      >

        <Input
          className={'drizzle-card-input'}
          placeholder="Number"
          name="number"
          autoComplete="cc-number"
          value={this.state.number}
          onChange={::this.onNumberChange}
          style={{ marginBottom: 15 }}
          maxLength={19}
          fullWidth
          required
        />

        <CreditCardIcon
          type={this.state.type}
          style={{
            margin: '2px 7px',
            right: '-5px',
          }}

        />

        <Input
          placeholder="Name"
          name="name"
          autoComplete="cc-name"
          style={styles.input}
          fullWidth
          required
        />

        <Input
          placeholder="MM/YY"
          type="text"
          name="expirationDate"
          autoComplete="cc-exp"
          maxLength="5"
          minLength="5"
          required
          style={{
            ...styles.input,
            ...styles.expirationDateInput,
          }}
        />

        <Input
          placeholder="CVC"
          name="cvc"
          autoComplete="cc-csc"
          type="text"
          maxLength="3"
          minLength="3"
          style={{
            ...styles.input,
            ...styles.cvcInput,
          }}
          required
        />

        <CreditCardIcon
          type={'cvc'}
          style={{
            margin: '2px 7px',
            right: '-5px',
          }}

        />

        <Button
          type={'submit'}
          label={'Save New Card'}
          btnSize={'small'}
          fullWidth
        />
      </form>
    );
  }
}

CardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default CardForm;
