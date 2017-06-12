import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
  ConfigurationBox,
  SubmitButton,
} from '/imports/ui/components';

import {
  ControlledInput,
  ControlledSelect,
} from '/imports/ui/components/ConfigurationInput';

const styles = {
  select: {
    height: 37,
    backgroundColor: 'white',
    flex: '0.3',
  },
};

const ReferralConfig = ({
  onToggle,
  onSubmit,
  toggled,
  referralConfig,
}) => (
  <ConfigurationToggle
    name="Referral Setup"
    toggled={toggled}
    onToggle={onToggle}
  >
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({
          giveNumber: event.target.giveNumber.value,
          giveType: event.target.giveType.value,
          earnNumber: event.target.earnNumber.value,
          earnType: event.target.earnType.value,
          condition: event.target.condition.value,
        });
      }}
    >
      <ConfigurationBox
        title="Reffered user gets:"
        titleStyle={{ fontWeight: 300 }}
        elementRight={
          <div >
            <ControlledInput
              name={'giveNumber'}

              value={referralConfig.giveNumber || 0}
              placeholder="Specify a number"
              style={{ marginRight: 10 }}
            />
            <ControlledSelect
              name={'giveType'}
              value={referralConfig.giveType}
              options={[{
                label: 'Dollars',
                value: 'dollars',
              }, {
                label: 'Days',
                value: 'days',
              }]}
              style={styles.select}
            />
          </div>
        }
      />

      <ConfigurationBox
        title="Refferer user gets:"
        titleStyle={{ fontWeight: 300 }}
        elementRight={
          <div>
            <ControlledInput
              name={'earnNumber'}
              placeholder="Specify a number"
              value={referralConfig.earnNumber || 0}
              style={{ marginRight: 10 }}
            />
            <ControlledSelect
              name={'earnType'}
              value={referralConfig.earnType}
              options={[{
                label: 'Dollars',
                value: 'dollars',
              }, {
                label: 'Days',
                value: 'days',
              }]}
              style={styles.select}
            />
          </div>
        }
      />

      <ConfigurationInput
        name="When: (condition)"
        inputName={'condition'}
        value={referralConfig.condition}
        isForm={false}
        options={[{
          label: 'When referred user adds card info',
          value: 'addCardInfo',
        }, {
          label: 'When referred user becomes paid subscriber',
          value: 'buyMonthlySubscription',
        }]}
      />

      <div style={{ marginTop: 11, textAlign: 'right' }}>
        <SubmitButton
          label={'Save'}
          btnStyle={'warning'}
          btnSize={'small'}
        />
      </div>
    </form>
  </ConfigurationToggle>
);

ReferralConfig.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
  referralConfig: PropTypes.object,
};

ReferralConfig.defaultProps = {
  referralConfig: {},
};

export default ReferralConfig;


// export default class ReferralSetup extends Component {
//   constructor(props) {
//     super(props);
//
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleConfigChange = this.handleConfigChange.bind(this);
//     this.toggleConfig = this.toggleConfig.bind(this);
//
//     this.state = {
//       config: props.product.referralConfig || {},
//     };
//   }
//
//   componentWillReceiveProps(nextProps) {
//     this.setState({
//       config: nextProps.product.referralConfig || {},
//     });
//   }
//
//   save() {
//     const { configReferral, product } = this.props;
//
//     const { config } = this.state;
//     configReferral({ productId: product._id, config });
//   }
//
//   toggleConfig(event) {
//     const { config } = this.state;
//     config.isEnabled = !!event.target.checked;
//
//     this.setState({ config });
//
//     setTimeout(() => {
//       this.save();
//     }, 0);
//   }
//
//   handleSubmit(event) {
//     event.preventDefault();
//
//     this.save();
//   }
//
//   handleConfigChange(event) {
//     let value = event.target.value;
//
//     if (event.target.type === 'number') {
//       value = Number(value) || 0;
//     }
//
//     const { config } = this.state;
//     config[event.target.name] = value;
//
//     this.setState({ config });
//   }
//
//   renderForm() {
//     const { config } = this.state;
//
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <div className="row">
//           <div className="col-md-6">
//             <label>Referred user gets:</label>
//             <input
//               className="form-control"
//               type="number"
//               name="giveNumber"
//               value={config.giveNumber || ''}
//               onChange={this.handleConfigChange}
//               required
//             />
//
//             <select
//               className="form-control"
//               name="giveType"
//               value={config.giveType || ''}
//               onChange={this.handleConfigChange}
//               required
//             >
//               <option value=""> ---- </option>
//               <option value="dollars">dollars</option>
//               <option value="days">days</option>
//             </select>
//           </div>
//
//           <div className="col-md-6">
//             <label>Referrer earns:</label>
//             <input
//               className="form-control"
//               type="number"
//               name="earnNumber"
//               value={config.earnNumber || ''}
//               onChange={this.handleConfigChange}
//               required
//             />
//
//             <select
//               className="form-control"
//               name="earnType"
//               value={config.earnType || ''}
//               onChange={this.handleConfigChange}
//               required
//             >
//               <option value=""> ---- </option>
//               <option value="dollars">dollars</option>
//               <option value="days">days</option>
//             </select>
//           </div>
//         </div>
//
//         <div>
//           <label>When:</label>
//           <select
//             className="form-control"
//             name="condition"
//             value={config.condition || ''}
//             onChange={this.handleConfigChange}
//             required
//           >
//             <option value=""> ---- </option>
//             <option value="addCardInfo">
//               when referred user adds card info
//             </option>
//             <option value="buyMonthlySubscription">
//               when referred user becomes paid subscriber
//             </option>
//           </select>
//         </div>
//
//         <div className="text-center margin-10">
//           <button
//             type="submit"
//             className="btn btn-primary"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     );
//   }
//
//   render() {
//     const { config } = this.state;
//
//     return (
//       <div>
//         <h2 className="col-xs-12 text-center gray-title">Referral Setup</h2>
//
//         <div className="text-center">
//           <table className="margin-auto">
//             <tbody>
//               <tr>
//                 <td>No</td>
//                 <td className="text-center">
//                   <Toggle
//                     id="subscriptionEnabled-switch"
//                     checked={!!config.isEnabled}
//                     onChange={this.toggleConfig}
//                   />
//                 </td>
//                 <td>Yes</td>
//               </tr>
//             </tbody>
//           </table>
//
//           {config.isEnabled ? this.renderForm() : null}
//         </div>
//       </div>
//     );
//   }
// }
//
//
// ReferralSetup.propTypes = {
//   configReferral: PropTypes.func.isRequired,
//   product: PropTypes.object.isRequired,
// };
