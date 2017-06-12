import React, { PropTypes, Component } from 'react';
import Pagination from '/imports/client/components/Pagination.jsx';

import InvitationForm from '../containers/InvitationForm';

const styles = {
  submitButton: {
    marginTop: 10,
  },
};

class Referral extends Component {
  renderRule() {
    const {
      product,
    } = this.props;

    const { referralConfig } = product;

    const {
      giveNumber,
      giveType,
      earnType,
      earnNumber,
      condition,
    } = referralConfig || {};

    let rule;

    if (earnType === 'days') {
      rule = `Earn ${earnNumber} day(s) of free access`;
    } else if (earnType === 'dollars') {
      rule = `Earn $${earnNumber}`;
    } else {
      return null;
    }

    if (giveType === 'days') {
      rule += ` and give ${giveNumber} day(s) of free access to your friend`;
    } else if (giveType === 'dollars') {
      rule += ` and give $${giveNumber} to your friend`;
    } else {
      return null;
    }

    if (condition === 'buyMonthlySubscription') {
      rule += ', if your friend signs up using your unique promo code and becomes a paid subscriber.';
    } else if (condition === 'addCardInfo') {
      rule += ', if your friend signs up using your unique promo code and add card info.';
    } else {
      return null;
    }

    return <p className="fs13">{rule}</p>;
  }

  renderEarning() {
    const {
      referralEarning,
    } = this.props;

    const {
      days,
      dollars,
    } = referralEarning || {};

    let text = '';

    if (days > 0) {
      text += `Total earned free access days: ${days}. `;
    }

    if (dollars > 0) {
      text += `Total earned money: $${dollars}. `;
    }

    return <p>{text}</p>;
  }

  renderRow(referral) {
    const givingUser = referral.givingUser();

    return (
      <tr key={referral._id}>
        <td id="history">{givingUser && givingUser.email || ''}</td>
        <td id="history">
          {referral.earnType === 'dollars' ? '$' : ''}
          {referral.earnNumber}
          {referral.earnType === 'days' ? ' days' : ''}
        </td>
      </tr>
    );
  }

  renderReferralList() {
    const { referrals, offset, limit, nextPage, previousPage } = this.props;

    return (
      <div className="text-center center">
        <Pagination
          offset={offset}
          limit={limit}
          count={referrals.length}
          onClickPrev={previousPage}
          onClickNext={nextPage}
        />

        <table id="history" className="card">
          <tbody>
            {referrals.map((charge) => this.renderRow(charge))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const {
      hasCardInfo,
      product,
      promoCode,
    } = this.props;

    if (!hasCardInfo) {
      return (
        <div>
          <p>
            Please <a href="/card-info">add card info</a> in order to use referrals.
          </p>
        </div>
      );
    }

    const { referralConfig } = product;

    const {
      isEnabled,
      giveNumber,
      giveType,
      earnType,
      earnNumber,
      condition,
    } = referralConfig || {};

    if (!referralConfig || !isEnabled || !giveNumber ||
        !giveType || !earnType || !earnNumber || !condition) {
      return null;
    }

    return (
      <div>
        <p>Your promo code: <span className="fw700">{promoCode}</span></p>

        {this.renderEarning()}
        {this.renderRule()}

        <InvitationForm />


        {this.renderReferralList()}


      </div>

    );
  }
}

Referral.propTypes = {
  product: PropTypes.object.isRequired,
  referralEarning: PropTypes.object.isRequired,
  promoCode: PropTypes.string,
  referrals: PropTypes.array.isRequired,
  previousPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  hasCardInfo: PropTypes.bool.isRequired,
};

export default Referral;
