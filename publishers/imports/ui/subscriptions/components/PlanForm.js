import React, { PropTypes, Component } from 'react';
import { Input, Button } from '/imports/ui/components';
import { ControlledSelect } from '/imports/ui/components/ConfigurationInput';

import { error } from '../../notifier';

const styles = {
  select: {
    height: 37,
    backgroundColor: 'white',
    flex: '0.3',
  },
};


export default class PlanForm extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save() {
    const { savePlan, product, plan, done } = this.props;

    if (plan && !confirm('Are you sure? Did you notify your users?')) { // eslint-disable-line
      return;
    }

    let trElement;

    if (plan) {
      trElement = document.querySelector(`.plan-${plan._id}-form`);
    } else {
      trElement = document.querySelector('.plan-form');
    }

    const name = trElement.querySelector('[name="name"]').value.trim();
    const price = Number(trElement.querySelector('[name="price"]').value.trim()) * 100;
    const type = trElement.querySelector('[name="type"]').value.trim();
    const stripePlanId = trElement.querySelector('[name="stripePlanId"]').value.trim();


    if (!name || !price) {
      error('Please input Name and Price');
      return;
    }

    if (!type) {
      error('Please select Type');
      return;
    }


    savePlan({
      productId: product._id,
      planId: plan && plan._id,
      stripePlanId,
      name,
      price,
      type,
    }, (err) => {
      if (!err) {
        trElement.querySelector('[name="name"]').value = '';
        trElement.querySelector('[name="price"]').value = '';
        trElement.querySelector('[name="type"]').value = '';
        if (done) { done(); }
      }
    });
  }

  cancel() {
    const { done } = this.props;
    if (done) { done(); }
  }

  render() {
    const { plan } = this.props;

    return (
      <tr className={plan && `plan-${plan._id}-form` || 'plan-form'}>
        <td>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            defaultValue={plan && plan.name}
          />
        </td>
        <td>
          <ControlledSelect
            name="type"
            placeholder="Select type"
            value={plan && plan.type}
            options={[
              { label: 'Monthly Subscription', value: 'monthlySubscription' },
              { label: 'Annual Subscription', value: 'annualSubscription' },
              { label: 'Single Payment', value: 'singlePayment' },
            ]}
            style={styles.select}
          />
        </td>
        <td>
          <Input
            name={'price'}
            type="text"
            placeholder="Price"
            defaultValue={plan && plan.price / 100}
          />
        </td>
        <td>
          <Input
            name={'stripePlanId'}
            type="text"
            placeholder="Stripe Plan ID"
            defaultValue={plan && plan.stripePlanId || ''}
          />
        </td>
        <td>
          <Button
            label={'Save'}
            btnStyle={'warning'}
            btnSize={'small'}
            onClick={this.save}
            style={{ marginRight: 10 }}
          />
          {plan && (
            <Button
              label={'Cancel'}
              btnStyle={'danger'}
              btnSize={'small'}
              onClick={this.cancel}
            />
          )}
        </td>
      </tr>
    );
  }
}

PlanForm.propTypes = {
  product: PropTypes.object.isRequired,
  savePlan: PropTypes.func.isRequired,
  done: PropTypes.func,
  plan: PropTypes.object,
};
