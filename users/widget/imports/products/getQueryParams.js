export default function getQueryParams(qs) {
  if (qs === '') return {};

  const params = {};

  for (let i = 0; i < qs.length; ++i) {
    const p = qs[i].split('=', 2);

    if (p.length === 1) {
      params[p[0]] = '';
    } else {
      params[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
  }

  return params;
}
