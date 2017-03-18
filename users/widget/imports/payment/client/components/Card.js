import React, { PropTypes } from 'react';
import { CardForm, CardInfo, Button } from '/imports/ui/components';
const styles = {
  stripeImg: {
    width: '120px',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    fontSize: 14,
    width: '100%',
  },
};

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: !!props.updateCard,
    };
  }

  toggleShowForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  handleSubmit(event) {
    this.props.onSubmit(event, () => {
      this.setState({
        showForm: false,
      });
    });
  }

  render() {
    const { card, isEmailVerified } = this.props;

    if (!isEmailVerified) {
      return (<div><p className="text-center">Please verify email</p></div>);
    }

    let cardInfo = '';
    let cardForm;

    if (card && !this.state.showForm) {
      cardInfo = (
        <div>
          <p> Your current card: </p>
          <hr style={{ marginTop: 0 }} />
          <CardInfo card={card} />
        </div>

      );
    }

    if (!card) {
      cardForm = (
        <div>
          <p> Add card information: </p>
          <hr style={{ marginTop: 0 }} />
          <CardForm onSubmit={::this.handleSubmit} />
        </div>
      );
    } else if (this.state.showForm) {
      cardForm = (
        <div>
          <p> Change card information: </p>
          <hr style={{ marginTop: 0 }} />
          <CardForm onSubmit={::this.handleSubmit} />
          <div className="center">
            <Button
              label={'Cancel'}
              onClick={::this.toggleShowForm}
              type={'button'}
              btnSize={'small'}
              fullWidth
              style={{ marginTop: 10 }}
            />
          </div>
        </div>
      );
    } else {
      cardForm = (
        <div className="center">
          <Button
            label={'Update Card'}
            onClick={::this.toggleShowForm}
            type="button"
            btnSize={'small'}
            style={{ marginTop: 10 }}
            fullWidth
          />
        </div>
      );
    }

    return (
      <div>
        {cardInfo}
        {cardForm}
        <div style={styles.footer}>
          <img
            src="https://s3-us-west-1.amazonaws.com/zenmarket/powered_by_stripe.png"
            alt="Powered by Stripe"
            style={styles.stripeImg}
          />
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string,
    brand: PropTypes.string,
    last4: PropTypes.string,
    exp_year: PropTypes.number,
    exp_month: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  isEmailVerified: PropTypes.bool.isRequired,
  updateCard: PropTypes.bool,
};

export default Card;
