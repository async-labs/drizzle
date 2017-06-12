import React, { PropTypes, Component } from 'react';
import { Button } from '/imports/ui/components';

import PlanForm from '../containers/PlanForm';

import '/imports/ui/components/Table/style.scss';

const styles = {
  table: {
    textAlign: 'center',
  },
  th: {
    textAlign: 'center',
    borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  },
};

export default class PlanList extends Component {
  constructor(props) {
    super(props);

    this.editPlan = this.editPlan.bind(this);
    this.deletePlan = this.deletePlan.bind(this);

    this.state = {
      editingPlanId: '',
    };
  }

  editPlan(event) {
    this.setState({ editingPlanId: event.target.dataset.id });
  }

  deletePlan(event) {
    if (!confirm('Are you sure?')) { // eslint-disable-line no-alert
      return;
    }

    const { deletePlan } = this.props;
    deletePlan({ planId: event.target.dataset.id });
  }

  renderRow(plan) {
    const { editingPlanId } = this.state;

    const done = () => {
      this.setState({ editingPlanId: '' });
    };

    if (editingPlanId === plan._id) {
      return <PlanForm plan={plan} key={plan._id} done={done} />;
    }

    return (
      <tr key={plan._id}>
        <td>{plan.name}</td>
        <td>{plan.getTypeDisplay()}</td>
        <td>${plan.price / 100}</td>
        <td>{plan && plan.stripePlanId || ''}</td>
        <td>
          <Button
            label={'Edit'}
            data-id={plan._id}
            onClick={this.editPlan}
            btnStyle={'warning'}
            btnSize={'small'}
            style={{ marginRight: 10 }}
          />
          <Button
            label={'Delete'}
            data-id={plan._id}
            onClick={this.deletePlan}
            btnStyle={'danger'}
            btnSize={'small'}
          />
        </td>
      </tr>
    );
  }

  render() {
    const { plans } = this.props;

    return (
      <div>
        <h2 className="text-center pad20 gray-title">
          Section-specific subscription plans
        </h2>

        <table className={'drizzle-table'} style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stripe Plan ID</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => this.renderRow(plan))}

            <PlanForm />
          </tbody>
        </table>
      </div>
    );
  }
}

PlanList.propTypes = {
  product: PropTypes.object.isRequired,
  plans: PropTypes.array.isRequired,
  deletePlan: PropTypes.func.isRequired,
};
