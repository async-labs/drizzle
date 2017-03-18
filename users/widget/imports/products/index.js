import { parse } from 'url';

import getQueryParams from './getQueryParams';

export function getPath(origUrl) {
  const parsedUrl = parse(origUrl);

  let url = parsedUrl.pathname;
  if (!url.endsWith('/')) {
    url += '/';
  }

  if (parsedUrl.query) {
    const queryParams = getQueryParams(parsedUrl.query.split('&'));

    if (queryParams.page) {
      url += `?page=${queryParams.page}`;
    }
  }

  return url;
}
