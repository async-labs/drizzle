import React, { PropTypes } from 'react';

import {
  ConfigurationInput,
  ConfigurationToggle,
} from '/imports/ui/components';

const MeteredPaywallToggle = ({ onToggle, onSubmit, toggled, value }) => (
  <ConfigurationToggle
    name="Metered Paywall"
    toggled={toggled}
    onToggle={onToggle}
    helpElement={(
      <span>
        Learn more about our&nbsp;
        <a
          href="http://publishers.getdrizzle.com/article/91-what-is-a-metered-paywall"
          target="blank"
        >
          metered paywall
        </a>
      </span>
    )}
  >
    <ConfigurationInput
      name="Specify number of free premium articles per user per month:"
      value={value}
      onSubmit={onSubmit}
      placeholder="Between 1 to 5"
    />
  </ConfigurationToggle>
);

MeteredPaywallToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default MeteredPaywallToggle;


// import { Meteor } from 'meteor/meteor';
// import React, { Component, PropTypes } from 'react';
// import Toggle from 'react-toggle';
//
// import { error } from '../../notifier';
//
// export default class MeteredPaywall extends Component {
//   constructor(props) {
//     super(props);
//
//     this.saveFreeCount = this.saveFreeCount.bind(this);
//     this.toggle = this.toggle.bind(this);
//
//     this.state = { enabled: !!props.product.freeArticleCount };
//   }
//
//   saveFreeCount(event) {
//     event.preventDefault();
//
//     const count = Number(this.freeCountNode.value.trim());
//     if (!count || count < 1 || count > 5) {
//       error('Please enter a number between 1 and 5.');
//       return;
//     }
//
//     const { product, saveFreeCount } = this.props;
//
//     saveFreeCount({ productId: product._id, count });
//   }
//
//   toggle(event) {
//     const checked = event.target.checked;
//     this.setState({ enabled: checked });
//
//     if (!checked) {
//       Meteor.call('products.disableFreeArticle', this.props.product._id);
//     }
//   }
//
//   render() {
//     const { product } = this.props;
//     const { enabled } = this.state;
//
//     if (!product) {
//       return <span></span>;
//     }
//
//     return (
//       <div>
//         <h2 className="col-xs-12 text-center gray-title">Metered Paywall</h2>
//         <div className="text-center paywall-menu">
//           <table className="margin-auto">
//             <tbody>
//               <tr>
//                 <td>No</td>
//                 <td className="text-center">
//                   <Toggle
//                     id="toggle-switch"
//                     name="toggle-switch"
//                     checked={enabled}
//                     onChange={this.toggle}
//                   />
//                 </td>
//                 <td>Yes</td>
//               </tr>
//             </tbody>
//           </table>
//           {enabled ?
//             <form className="text-center" style={{ float: 'none' }} onSubmit={this.saveFreeCount}>
//               <label>
//                 Specify number of free premium articles per user per month:
//                 <input
//                   type="number"
//                   className="margin-l-10"
//                   placeholder="Between 1 to 5"
//                   defaultValue={product.freeArticleCount}
//                   ref={node => {
//                     this.freeCountNode = node;
//                   }}
//                 />
//               </label>
//
//               <button
//                 className="btn btn-primary"
//                 type="submit"
//               >
//                 Save
//               </button>
//             </form>
//             : ''}
//         </div>
//         <p className="text-center">
//           Learn more about&nbsp;
//           <a href="http://publishers.getdrizzle.com/article/91-what-is-a-metered-paywall" target="_blank">
//              metered paywall
//           </a>
//         </p>
//       </div>
//     );
//   }
// }
//
// MeteredPaywall.propTypes = {
//   product: PropTypes.object.isRequired,
//   saveFreeCount: PropTypes.func.isRequired,
// };
