import cheerio from 'cheerio';
import { HTTP } from 'meteor/http';

export default function checkSetup(product) {
  try {
    const res = HTTP.get(product.url);
    if (res.statusCode !== 200) {
      throw new Error();
    }

    const $ = cheerio.load(res.content);
    let installed = false;
    let verified = product.claimStatus === 'verified';

    $('script').each((index, elm2) => {
      const elm = elm2.children && elm2.children[0];

      if (!elm || !elm.data) { return; }

      if (!installed) {
        installed = elm.data.indexOf('https://s3-us-west-1.amazonaws.com/zenmarket/for-widget.js') > -1;

        /* installed = (
          elm.data.indexOf('https://s3-us-west-1.amazonaws.com/zenmarket/for-widget.js') > -1 ||
          elm.data.indexOf('http://localhost:8070/static/widget.js') > -1
        );*/
      }

      if (!verified) {
        verified = elm.data.indexOf(`script["data-key"] = "${product.verifyKey}";`) > -1;
      }
    });

    if (product.claimStatus !== 'verified' && verified) {
      verified = true;
    }

    return { installed, verified };
  } catch (e) {
    return { installed: false, verified: false };
  }
}
