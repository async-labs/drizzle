import { parse } from 'url';
import { Picker } from 'meteor/meteorhacks:picker';
import { getProductByUrl } from 'meteor/drizzle:util';

Picker.route('/', (params, req, res, next) => {
  const query = parse(req.url, true).query;
  let isWrong = false;

  if (!query.url) {
    isWrong = true;
  } else {
    const { referer } = req.headers;
    if (!referer || referer !== query.url) {
      isWrong = process.env.NODE_ENV !== 'development'; // eslint-disable-line no-undef
    }
  }

  if (!isWrong) {
    if (!getProductByUrl(query.url)) {
      isWrong = true;
    }
  }

  if (isWrong) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  } else {
    next();
  }
});

import './methods';
