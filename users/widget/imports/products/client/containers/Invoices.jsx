import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { getCurrentProduct } from '/imports/products/client/api';
import { ContentWallCharges } from 'meteor/drizzle:models';

import Invoices from '../components/Invoices.jsx';
import Paginated from '/imports/ui/enhancers/Paginated';

function composer(props, onData) {
  const { offset, limit } = props;
  const product = getCurrentProduct();

  if (!product) { return; }

  const sub = Meteor.subscribe('products/userPaygCharges', {
    offset,
    limit,
    all: false,
    productId: product._id,
  });

  if (sub.ready()) {
    const filter = { userId: Meteor.userId() };
    const charges = ContentWallCharges.find(filter).fetch();

    onData(null, {
      charges,
      offset,
      limit,
      domain: product.domain,
    });
  }
}

export default Paginated(composeWithTracker(composer)(Invoices));
