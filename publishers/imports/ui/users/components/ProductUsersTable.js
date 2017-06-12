import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

import { error, success } from '/imports/ui/notifier';
import { Table } from '/imports/ui/components';
import SendEmailFormModal from './SendEmailFormModal';
import SubscribeModal from '../containers/SubscribeModal';
import {
  OverlayTrigger,
  Tooltip as BSTooltip,
} from 'react-bootstrap';

const Tooltip = ({ text }) => (
  <OverlayTrigger
    placement="top"
    overlay={
      <BSTooltip id="tooltip">
        <strong>
          {text}
        </strong>
      </BSTooltip>
    }
  >
    <a href="#"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
  </OverlayTrigger>
);

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
};


class ProductUsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProductUserId: undefined,
      selectedSubscribeUserId: undefined,
    };
  }


  handleEmailLinkClick(productUserId) {
    this.setState({ selectedProductUserId: productUserId });
  }

  handleUnsubscribe(productUserId) {
    Meteor.call('productUsers.unsubscribe', productUserId, (err) => {
      if (err) {
        error(err);
      } else {
        success('Unsubscribed');
      }
    });
  }

  renderSendEmailToUserModal() {
    const { product, handleSendEmailToUser } = this.props;
    const isMailgunConfigured = !!(
      product.mailgunConfig &&
      product.mailgunConfig.apiKey &&
      product.mailgunConfig.domain &&
      product.mailgunConfig.fromName &&
      product.mailgunConfig.fromEmail
    );

    return (
      <div
        className="modal fade"
        id="sendEmailToUserModal"
        tabIndex="-1"
        role="dialog"
        ref="sendEmailToUserModal"
      >
        <div className="modal-dialog" role="document">
          <SendEmailFormModal
            onSubmit={(event) => {
              event.preventDefault();
              const { body, subject } = event.target;
              handleSendEmailToUser({
                productId: product._id,
                productUserId: this.state.selectedProductUserId,
                body: body.value,
                subject: subject.value,
              });
            }}
            isMailgunConfigured={isMailgunConfigured}
          />
        </div>
      </div>
    );
  }

  renderSubscribeUserModal() {
    const { selectedSubscribeUserId } = this.state;
    return (
      <div
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        ref="subscribeModal"
      >
        <SubscribeModal
          productUserId={selectedSubscribeUserId}
        />
      </div>
    );
  }

  renderEmail(productUser) {
    const user = productUser.user();
    const isFacebookUser = !!(user && user.services && user.services.facebook);

    return (
      <span>
        {productUser.email}
        &nbsp;
        {user && user.isEmailVerified() && (
          <i
            title="Verified"
            className="fa fa-check-circle"
            aria-hidden="true"
            style={{ color: '#337AB7' }}
          ></i>
        ) || null}
        &nbsp;
        <a
          href="#"
          data-toggle="modal"
          data-target="#sendEmailToUserModal"
          onClick={() => ::this.handleEmailLinkClick(productUser._id)}
        >
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
        </a>
        &nbsp;
        {isFacebookUser && (
          <a
            href={user.services.facebook.link}
            target="_blank"
            style={{ fontSize: '13px', padding: '5px' }}
          >
            <i className="fa fa-facebook" aria-hidden="true"></i>
          </a>
        ) || null}
        &nbsp;
        {productUser.isRefunded && (
          <OverlayTrigger
            placement="top"
            overlay={
              <BSTooltip id="tooltip">
                refunded
              </BSTooltip>
            }
          >
            <a href="#"><i className="fa fa-minus-circle" aria-hidden="true"></i></a>
          </OverlayTrigger>
        ) || null}
      </span>
    );
  }

  renderSubsribeToggle(productUser) {
    if (!productUser.isSubscribed && !productUser.isWeeklySubscribed &&
        (!productUser.subscribedPlanIds || productUser.subscribedPlanIds.length === 0)) {
      return (
        <input
          type="checkbox"
          disabled
        />
      );
    }

    return (
      <input
        type="checkbox"
        onChange={() => ::this.handleUnsubscribe(productUser._id)}
        data-id={productUser._id}
        defaultChecked
      />
    );
  }

  renderReferralAndFreeUnlock(productUser) {
    let referral = '';
    if (productUser.isReferrer) {
      referral += 'referrer';
    } else if (productUser.isReferred) {
      referral += 'referred';
    } else {
      referral += 'na';
    }

    return `${referral}, ${productUser.totalUnlockedCount || 0}`;
  }

  renderIsSubscribed(productUser) {
    let subscribed;

    if (productUser.isSubscribed) {
      subscribed = 'Monthly';
    } else if (productUser.isWeeklySubscribed) {
      subscribed = 'Weekly';
    } else if (productUser.isAnnualSubscribed) {
      subscribed = 'Annual';
    } else {
      const plan = !subscribed && productUser.plan();
      if (plan) {
        subscribed = plan.name;
      }
    }

    if (subscribed) {
      if (productUser.subscribedDate && !productUser.hasFreeAccess) {
        subscribed = `${subscribed} (${moment(productUser.subscribedDate).format('MMM DD YYYY')})`;
      }

      if (productUser.usedDiscountCode && !productUser.hasFreeAccess) {
        subscribed += ' (with discount)';
      }

      return subscribed;
    }

    subscribed = 'No';
    if (productUser.hasFreeAccess) {
      subscribed = 'Free Access';
    }

    return (
      <span>
        {subscribed} <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            this.setState({ selectedSubscribeUserId: productUser._id });
            $(this.refs.subscribeModal).modal('show');
            return false;
          }}
        >
          {productUser.hasFreeAccess
            ? <i className="fa fa-minus-square" aria-hidden="true"></i>
            : <i className="fa fa-plus-square" aria-hidden="true"></i>}
        </a>
      </span>
    );
  }

  renderFreeTrial(productUser) {
    if (!productUser.freeTrialEndAt) {
      return 'No';
    }

    const now = new Date();

    if (moment(productUser.freeTrialEndAt).isBefore(now)) {
      return 'No (ended)';
    }

    return `Yes (${moment(productUser.freeTrialEndAt).diff(now, 'days')})`;
  }

  renderRegisteredAt(productUser) {
    const text = productUser.isRegisteredAtIt ? 'Yes' : 'No';

    let registeredAt;
    if (productUser.registeredAt) {
      registeredAt = (
        <a href={productUser.registeredAt} target="_blank">
          <i className="fa fa-external-link" aria-hidden="true"></i>
        </a>
      );
    }

    const date = (<span
      style={{ fontSize: '11px' }}
    >
      ({moment(productUser.createdAt).format('MM-DD-YY')})
    </span>);

    return (
      <span>
        {text} {date} {registeredAt}
      </span>
    );
  }

  renderIsUnsubscribed(productUser) {
    let unsubscribed;
    if (productUser.isUnsubscribed) {
      unsubscribed = 'Yes';
    } else if (productUser.isWeeklyUnsubscribed) {
      unsubscribed = 'Yes';
    } else if (productUser.isAnnualUnsubscribed) {
      unsubscribed = 'Yes';
    } else if (productUser.unsubscribedPlanIds && productUser.unsubscribedPlanIds.length > 0) {
      unsubscribed = 'Yes';
    }

    if (unsubscribed) {
      if (productUser.unsubscribedDate) {
        unsubscribed += ` (${moment(productUser.unsubscribedDate).format('MMM DD YYYY')})`;
      }

      return unsubscribed;
    }

    return 'No';
  }


  render() {
    const { productUsers } = this.props;
    return (
      <span>
        <Table
          headers={[
            'Name',
            'Email',
            <div>Registered <Tooltip text="User registered on this website and link to registration page" /> </div>,
            <div>Paid <Tooltip text="User made single payment" /></div>,
            <div>Daily Pass <Tooltip text="User bought daily pass" /></div>,
            <div>Trial <Tooltip text="User opted-in free trial" /></div>,
            <div>Subscribed <Tooltip text="User purchased subscription" /></div>,
            <div>Unsubscribed <Tooltip text="User unsubscribed from paid subscription" /></div>,
            <div>
              <span>Referral, <Tooltip text="Referral Status: referred someone or got referred" /></span><br />
              <span>Metered access <Tooltip text="Number of times user access content for free via Metered paywall" /></span><br />
            </div>,
            <div>Total $ <Tooltip text="Total number of $ spent by user on this website" /></div>,
            <div>Imported <Tooltip text="User was imported by Admin. Uncheck checkbox to unsubscribe imported user." /></div>,
          ]}
          records={productUsers.map(productUser => ({
            name: productUser.getFullName(),
            email: this.renderEmail(productUser),
            registered: this.renderRegisteredAt(productUser),
            singlePayment: productUser.isMicropaid ? 'Yes' : 'No',
            dailyAccess: productUser.isBoughtDailyAccess ? 'Yes' : 'No',
            freeTrial: this.renderFreeTrial(productUser),
            subscribed: this.renderIsSubscribed(productUser),
            unsubscribed: this.renderIsUnsubscribed(productUser),
            referralAndFreUnlocks: this.renderReferralAndFreeUnlock(productUser),
            total: `$${(productUser.totalSpent / 100).toFixed(2)}`,
            imported: productUser.imported ? this.renderSubsribeToggle(productUser) : 'No',
          }))}
        />

        {this.renderSendEmailToUserModal()}
        {this.renderSubscribeUserModal()}
      </span>
    );
  }
}

ProductUsersTable.propTypes = {
  productUsers: PropTypes.arrayOf(PropTypes.object),
  handleSendEmailToUser: PropTypes.func.isRequired,

  // TODO: Will remove this soon
  product: PropTypes.object,
};

export default ProductUsersTable;
