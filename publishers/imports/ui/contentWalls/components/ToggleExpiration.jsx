import React, { PropTypes, Component } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';

class ToggleExpiration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: props.toggled,
    };
  }

  handleToggle(toggled) {
    this.setState({ toggled });
  }

  render() {
    const { onSubmit, numberOfdays, onToggle, toggled } = this.props;
    return (
      <ConfigurationToggle
        name="Expiration of Access"
        toggled={toggled}
        onToggle={onToggle}
      >
        <ConfigurationInput
          name={'Specify Number of Days:'}
          value={numberOfdays}
          onSubmit={value => onSubmit({
            expirationEnabled: this.state.toggled,
            numberOfdays: Number(value),
          })}
        />
      </ConfigurationToggle>
    );
  }

}

ToggleExpiration.propTypes = {
  numberOfdays: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default ToggleExpiration;

// import Toggle from 'react-toggle';
//
// export default class ToggleExpiration extends Component {
//   constructor(props) {
//     super(props);
//
//     this.toggle = this.toggle.bind(this);
//     this.saveConfig = this.saveConfig.bind(this);
//
//     const { wall } = props;
//
//     this.state = {
//       enabled: !!wall.expirationHours,
//     };
//   }
//
//   toggle(event) {
//     const enabled = event.target.checked;
//     this.setState({ enabled });
//
//     const { wall, configExpiration } = this.props;
//     const numberOfdays = wall.expirationHours && wall.expirationHours / 24 || 0;
//     configExpiration({ wallId: wall._id, expirationEnabled: enabled, numberOfdays });
//   }
//
//   saveConfig(event) {
//     event.preventDefault();
//     const numberOfdays = Number(event.target.days.value);
//     const { wall, configExpiration } = this.props;
//
//     configExpiration({ wallId: wall._id, numberOfdays, expirationEnabled: wall.expirationEnabled });
//   }
//
//   render() {
//     const { wall } = this.props;
//     const { enabled } = this.state;
//     const numberOfdays = wall.expirationHours && wall.expirationHours / 24 || '';
//
//     if (!wall) {
//       return <span></span>;
//     }
//
//     let form = null;
//     if (enabled) {
//       form = (
//         <form onSubmit={this.saveConfig}>
//           <table className="margin-auto">
//             <tbody>
//               <tr>
//                 <td>
//                   Specify number of days:
//                 </td>
//                 <td>
//                   <input name="days" type="nubmer" defaultValue={numberOfdays} />
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td>
//                   <button className="btn btn-primary" type="submit">Save</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </form>
//       );
//     }
//
//     return (
//       <div style={{ backgroundColor: '#f9f9f9' }}>
//         <h3 className="text-center pad20">Expiration of access</h3>
//         <table className="margin-auto">
//           <tbody>
//             <tr>
//               <td>No</td>
//               <td className="text-center">
//                 <Toggle
//                   defaultChecked={enabled}
//                   onChange={this.toggle}
//                 />
//               </td>
//               <td>Yes</td>
//             </tr>
//           </tbody>
//         </table>
//         {form}
//       </div>
//     );
//   }
// }
//
// ToggleExpiration.propTypes = {
//   wall: PropTypes.object.isRequired,
//   configExpiration: PropTypes.func.isRequired,
// };
