import React, { PropTypes } from 'react';
import { error, success } from '/imports/notifier';

import { addBank, verifyBank } from '../actions';

export const BankForm = React.createClass({
  propTypes: {
    submitButtonText: PropTypes.string,
    hasAccount: PropTypes.bool.isRequired,
    done: PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.fields = {};
  },

  onSubmit(e) {
    e.preventDefault();

    const { done } = this.props;

    const data = {
      routing_number: this.fields.routing_number.value.trim(),
      account_number: this.fields.account_number.value.trim(),
      account_holder_name: this.fields.account_holder_name.value.trim(),
      account_holder_type: this.fields.account_holder_type.value.trim(),
    };

    if (!data.routing_number || !data.account_number ||
        !data.account_holder_name || !data.account_holder_type) {
      return error('Please fill all fields!');
    }

    addBank(data, (err) => {
      if (err) {
        return error(err);
      }

      success('Succefully added');
      done();
    });
  },

  render() {
    const { hasAccount } = this.props;
    const title = `${hasAccount ? 'Update bank account' : 'Add US bank account'}`;

    return (
      <div className="card">
        <p className="margin-5">{title}</p>
        <form className="center" onSubmit={this.onSubmit}>

          <select
            className="margin-5"
            placeholder="Account Holder Type"
            required
            ref={node => {
              this.fields.account_holder_type = node;
            }}
          >
            <option value="">- Account Holder Type -</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>

          <input
            placeholder="Routing Number"
            required
            ref={node => {
              this.fields.routing_number = node;
            }}
          />
          <input
            placeholder="Account Number"
            required
            ref={node => {
              this.fields.account_number = node;
            }}
          />
          <input
            placeholder="Account Holder Name"
            required
            ref={node => {
              this.fields.account_holder_name = node;
            }}
          />

          <div className="center">
            <button className="btn btn-default" type="submit">
              {this.props.submitButtonText || 'Update'}
            </button>
          </div>
        </form>
      </div>
    );
  },
});


export const VerifyAccount = React.createClass({
  propTypes: {
    bankAccount: PropTypes.object.isRequired,
  },

  componentWillMount() {
    this.fields = {};
  },

  getInitialState() {
    return { showForm: false };
  },

  showForm() {
    this.setState({ showForm: true });
  },

  onSubmit(e) {
    e.preventDefault();

    const data = {
      amount1: Number(this.fields.amount1.value.trim()),
      amount2: Number(this.fields.amount2.value.trim()),
    };

    if (!data.amount1 || !data.amount2) {
      return error('Please fill all fields!');
    }

    verifyBank(data, (err) => {
      if (err) {
        return error(err);
      }

      success('Succefully verified');
      this.setState({ showForm: false });
    });
  },

  renderForm() {
    return (
      <div className="card">
        <h4>Enter deposit values in cents</h4>

        <form className="center" onSubmit={this.onSubmit}>
          <input
            type="number"
            placeholder="Amount 1"
            required
            ref={node => {
              this.fields.amount1 = node;
            }}
          />
          <input
            type="number"
            placeholder="Amount 2"
            required
            ref={node => {
              this.fields.amount2 = node;
            }}
          />

          <div className="center">
            <button className="btn btn-default" type="submit">
              Verify
            </button>
          </div>
        </form>
      </div>
    );
  },

  render() {
    const account = this.props.bankAccount;
    const { showForm } = this.state;

    if (showForm) {
      return this.renderForm();
    }

    if (account.status === 'verified') {
      return (
        <div>verified</div>
      );
    }

    return (
      <div>
        not verified
        <button onClick={this.showForm}>Verify</button>
      </div>
    );
  },
});


const Bank = React.createClass({
  propTypes: {
    bankAccount: PropTypes.object,
  },

  getInitialState() {
    return {
      showForm: false,
    };
  },

  showForm() {
    this.setState({ showForm: true });
  },

  hideForm() {
    this.setState({ showForm: false });
  },

  render() {
    const { bankAccount } = this.props;

    let accountInfo = '';
    let form;

    if (bankAccount) {
      accountInfo = (
      <div className="card">
        <h4 className="margin-0">Your bank account:</h4>
        <ul className="card">
          <li>Bank Name - {bankAccount.bank_name}</li>
          <li>Holder Name - {bankAccount.account_holder_name}</li>
          <li>Number - **** **** **** {bankAccount.last4}</li>
          <li>Rounter Number - {bankAccount.routing_number}</li>
        </ul>
        <VerifyAccount bankAccount={bankAccount} />
      </div>
      );
    }

    if (!bankAccount || this.state.showForm) {
      form = (<BankForm
        done={this.hideForm}
        submitButtonText={bankAccount ? 'Update' : 'Add'}
        hasAccount={!!bankAccount}
      />);
    } else {
      form = (
        <div className="center">
          <button className="btn btn-default" onClick={this.showForm} type="button">
            Update account
          </button>
        </div>
      );
    }

    return (
      <div>
        {accountInfo}
        {form}
      </div>
    );
  },
});

export default Bank;
