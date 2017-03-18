import bodyParser from 'body-parser';
import { parse } from 'url';
import cheerio from 'cheerio';

import { check, Match } from 'meteor/check';

import { Picker } from 'meteor/meteorhacks:picker';

import {
  Products,
  ContentWalls,
  WpPluginWebsites,
} from 'meteor/drizzle:models';

import { getScore, getProductByUrl } from 'meteor/drizzle:util';
import { EmbedlyAdapter } from 'meteor/drizzle:integrations';

const API_PATH = '/wp-api/v1/';
const SECRET_KEY = 'v_ukjEl9aSUX6u7jJLjqCZagjk4-WQUDukVoaeYBgdT';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

function getPath(origUrl) {
  let url = parse(origUrl);
  url = url.pathname;
  if (!url.endsWith('/')) {
    url += '/';
  }

  return url;
}

function trackEvent({ url, secretKey, event }) {
  const EVENTS = ['activated', 'deactivated'];

  try {
    check(secretKey, String);
    check(url, String);
    check(event, String);
  } catch (e) {
    return JSON.stringify({ status: 'invalid', error: 'Invalid data' });
  }

  if (SECRET_KEY !== secretKey) {
    return JSON.stringify({ status: 'invalid', error: 'Invalid secret key' });
  }

  if (EVENTS.indexOf(event) === -1) {
    return JSON.stringify({ status: 'invalid', error: 'Invalid event name' });
  }

  const domain = parse(url).host;
  if (!domain) {
    return JSON.stringify({ status: 'invalid', error: 'Wrong url' });
  }

  let website = WpPluginWebsites.findOne({ url });
  try {
    if (!website) {
      website = { _id: WpPluginWebsites.insert({ url, domain }) };
    }
  } catch (err) {
    return JSON.stringify({ status: 'invalid', error: err.toString() });
  }

  const modifier = {};
  modifier[event] = true;
  modifier[`${event}At`] = new Date();

  WpPluginWebsites.update(website._id, { $set: modifier });

  return JSON.stringify({ status: 'valid' });
}

function validateKeyAndGetProduct({ key, blog }) {
  try {
    check(key, String);
    check(blog, String);
  } catch (e) {
    return false;
  }

  if (!key || !blog) {
    return false;
  }

  const product = getProductByUrl(blog);
  if (!product) {
    return false;
  }

  const { wpPlugin } = product;
  if (!wpPlugin || !wpPlugin.apiKey) {
    Products.update(product._id, {
      $unset: { 'wpPlugin.isKeyInstalled': 1 },
      $set: { claimStatus: 'pending' },
    });

    return false;
  }

  if (wpPlugin.apiKey === key) {
    Products.update(product._id, {
      $set: { 'wpPlugin.isKeyInstalled': true, claimStatus: 'verified' },
    });

    return product;
  }

  Products.update(product._id, {
    $unset: { 'wpPlugin.isKeyInstalled': 1 },
    $set: { claimStatus: 'pending' },
  });

  return false;
}

function createOrUpdateWallPerContent({
  id,
  product,
  fullUrl,
  title,
  content,
  disabled,
  url,
  embedlyData,
}) {
  let wall;
  if (id) {
    wall = ContentWalls.findOne({ productId: product._id, externalId: id });
  }

  if (!wall) {
    wall = ContentWalls.findOne({ url: fullUrl });
  }

  title = title.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // eslint-disable-line
  title = cheerio('<p/>').html(title).text() // eslint-disable-line
            .replace(/&/g, '&amp;');

  if (!wall) {
    const createdAt = new Date();
    const obj = {
      title,
      url: fullUrl,
      productId: product._id,
      createdAt,
      sellCount: 0,
      totalIncome: 0,
      price: product.defaultWallPrice || 25,
      score: getScore(0, createdAt),
      content: { original: content },

      disabled: !!disabled,
    };

    if (embedlyData && embedlyData.description) {
      obj.description = embedlyData.description;
      obj.thumbnailUrl = embedlyData.thumbnailUrl;
    }

    if (product.defaultWallPrice) {
      obj.fixedPricing = true;
    }

    if (id) {
      obj.externalId = id;
    }

    try {
      ContentWalls.insert(obj);
    } catch (err) {
      if (err.code === 11000) {
        return console.log('Duplicated wall not added.', url);
      }
      throw err;
    }

    return true;
  }

  const modifier = {
    title,
    url: fullUrl,
    content: {
      original: content,
    },

    disabled: !!disabled,
  };

  if (embedlyData && embedlyData.description) {
    modifier.description = embedlyData.description;
    modifier.thumbnailUrl = embedlyData.thumbnailUrl;
  }

  if (id) {
    modifier.externalId = id;
  }

  ContentWalls.update(wall._id, { $set: modifier });

  return true;
}

function createOrUpdateWall({
  content,
  url,
  key,
  title,
  id,
  disabled,
}) {
  const product = validateKeyAndGetProduct({ key, blog: url });
  if (!product) {
    return false;
  }

  try {
    check(content, Match.OneOf(String, [String])); // eslint-disable-line
    check(url, String);
    check(title, String);
    check(id, Match.Maybe(String)); // eslint-disable-line new-cap

    check(disabled, Match.Maybe(String)); // eslint-disable-line new-cap
  } catch (e) {
    return false;
  }

  if (!url) {
    return false;
  }

  if (!product.isClientSide && !content) {
    return false;
  }

  const path = getPath(url);
  const fullUrl = `${parse(url).host}${path}`;

  let embedlyData;
  try {
    embedlyData = EmbedlyAdapter.extract(url);
  } catch (e) {
    // pass
  }

  if (typeof content === 'string') {
    return createOrUpdateWallPerContent({
      id,
      product,
      fullUrl,
      title,
      content,
      disabled,
      url,
      embedlyData,
    });
  }

  if (content.length === 0) {
    return false;
  }

  createOrUpdateWallPerContent({
    id,
    product,
    fullUrl,
    title,
    content: content[0],
    disabled,
    url,
    embedlyData,
  });

  content.shift();

  content.forEach((c, i) => {
    createOrUpdateWallPerContent({
      id: id ? `${id}-page${i + 1}` : id,
      product,
      fullUrl: `${fullUrl}?page=${i + 1}`,
      title: `${title}-Page ${i + 1}`,
      content: c,
      disabled,
      url: `${url}?page=${i + 1}`,
    });
  });

  return true;
}

const apiRoutes = Picker.filter((req) => req.method === 'POST');

apiRoutes.route(`${API_PATH}verify-key`, (params, req, res) => {
  if (validateKeyAndGetProduct(req.body)) {
    res.end('valid');
  } else {
    res.end('invalid');
  }
});

apiRoutes.route(`${API_PATH}deactivate`, (params, req, res) => {
  const product = validateKeyAndGetProduct(req.body);

  if (!product) {
    return res.end('invalid');
  }

  Products.update(product._id, { $unset: { 'wpPlugin.apiKey': 1, 'wpPlugin.isKeyInstalled': 1 } });

  return res.end('deactivated');
});

apiRoutes.route(`${API_PATH}create-wall`, (params, req, res) => {
  const result = { status: 'invalid' };

  if (!req.body.content) {
    const contents = [];

    let i = 0;
    while (req.body[`content[${i}]`]) {
      contents.push(req.body[`content[${i}]`]);
      i++;
    }

    if (contents.length > 0) {
      req.body.content = contents;
    }
  }

  if (createOrUpdateWall(req.body)) {
    result.status = 'valid';
  }

  return res.end(JSON.stringify(result));
});


apiRoutes.route(`${API_PATH}change-walltype`, (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  const {
    key,
    url,
    id,
    disabled,
  } = req.body;

  const product = validateKeyAndGetProduct({ key, blog: url });

  if (!product) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Invalid data' }));
  }

  try {
    check(url, Match.Maybe(String)); // eslint-disable-line
    check(id, Match.Maybe(String)); // eslint-disable-line

    check(disabled, Match.Maybe(String)); // eslint-disable-line new-cap
  } catch (e) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Invalid data' }));
  }

  let wall;

  if (id) {
    wall = ContentWalls.findOne({ productId: product._id, externalId: id });
  }

  if (!wall && url) {
    const path = getPath(url);
    const fullUrl = `${parse(url).host}${path}`;

    wall = ContentWalls.findOne({ url: fullUrl });
  }

  if (!wall) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Wall not found' }));
  }

  const modifier = {
    disabled: !!disabled,
  };

  if (id) {
    modifier.externalId = id;
  }

  ContentWalls.update(wall._id, { $set: modifier });

  return res.end(JSON.stringify({ status: 'valid' }));
});


apiRoutes.route(`${API_PATH}event`, (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  return res.end(trackEvent(req.body));
});
