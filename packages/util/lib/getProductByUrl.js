import { parse } from 'url';
import { Products } from 'meteor/drizzle:models';

export default (url) => {
  const domain = parse(url).host;
  return Products.findOne({ domain, vendorUserId: { $exists: true } });
};
