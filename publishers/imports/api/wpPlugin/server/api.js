import bodyParser from 'body-parser';
import { parse } from 'url';
import cheerio from 'cheerio';

import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { Picker } from 'meteor/meteorhacks:picker';

import {
  Products,
  Plans,
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
  leadGeneration,
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

      leadGeneration: !!leadGeneration,
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

    leadGeneration: !!leadGeneration,
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
  leadGeneration,
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

    check(leadGeneration, Match.Maybe(String)); // eslint-disable-line new-cap
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
      leadGeneration,
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
    leadGeneration,
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
      leadGeneration,
      disabled,
      url: `${url}?page=${i + 1}`,
    });
  });

  return true;
}


function getPlans({ url, key }) {
  const product = validateKeyAndGetProduct({ key, blog: url });
  if (!product) {
    return false;
  }

  return Plans.find({ productId: product._id }).fetch();
}


function getWalls({ url, key, filter }) {
  const product = validateKeyAndGetProduct({ key, blog: url });
  if (!product) {
    return false;
  }

  const f = _.extend({ productId: product._id }, filter);

  return ContentWalls.find(
    f,
    { fields: { url: 1, subscriptionPlanIds: 1, externalId: 1 } }
  ).fetch();
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
    leadGeneration,
    disabled,
  } = req.body;

  const product = validateKeyAndGetProduct({ key, blog: url });

  if (!product) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Invalid data' }));
  }

  try {
    check(url, Match.Maybe(String)); // eslint-disable-line
    check(id, Match.Maybe(String)); // eslint-disable-line

    check(leadGeneration, Match.Maybe(String)); // eslint-disable-line new-cap
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
    leadGeneration: !!leadGeneration,
    disabled: !!disabled,
  };

  if (id) {
    modifier.externalId = id;
  }

  ContentWalls.update(wall._id, { $set: modifier });

  return res.end(JSON.stringify({ status: 'valid' }));
});


apiRoutes.route(`${API_PATH}get-plans`, (params, req, res) => {
  const result = { status: 'invalid' };

  const plans = getPlans(req.body);
  if (plans) {
    result.status = 'valid';
    result.plans = plans;
  }
  return res.end(JSON.stringify(result));
});


apiRoutes.route(`${API_PATH}set-plan`, (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  const { key, url, planId, id } = req.body;

  const product = validateKeyAndGetProduct({ key, blog: url });

  if (!product) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Invalid data' }));
  }

  try {
    check(planId, String);
    check(url, Match.Maybe(String)); // eslint-disable-line
    check(id, Match.Maybe(String)); // eslint-disable-line
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

  const modifier = {};
  if (id) {
    modifier.externalId = id;
  }

  if (planId === '') {
    modifier.subscriptionPlanIds = [];
  } else {
    const plan = Plans.findOne(planId);
    if (!plan) {
      return res.end(JSON.stringify({ status: 'invalid', error: 'Plan not found' }));
    }
    modifier.subscriptionPlanIds = [plan._id];
  }

  ContentWalls.update(wall._id, { $set: modifier });

  return res.end(JSON.stringify({ status: 'valid' }));
});


apiRoutes.route(`${API_PATH}get-walls`, (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  const { key, url } = req.body;

  const plans = getPlans(req.body);
  let walls = getWalls({ key, url, filter: { subscriptionPlanIds: { $exists: true } } });

  if (!plans || !walls) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Invalid data' }));
  }

  const planNames = {};
  plans.forEach(plan => {
    planNames[plan._id] = plan.name;
  });

  walls = _.filter(walls.map(wall => {
    if (!wall.subscriptionPlanIds || wall.subscriptionPlanIds.length === 0) {
      return null;
    }

    const planId = wall.subscriptionPlanIds[0];
    if (!planId) {
      return null;
    }

    const planName = planNames[planId];
    if (!planName) {
      return null;
    }

    const obj = _.extend({ planName }, _.pick(wall, 'url', '_id'));
    obj.externalId = wall.externalId || wall.url;

    return obj;
  }), w => w);

  return res.end(JSON.stringify({ status: 'valid', walls }));
});


apiRoutes.route(`${API_PATH}event`, (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  return res.end(trackEvent(req.body));
});
