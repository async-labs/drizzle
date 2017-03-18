import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';

const API_URL = 'https://api.embed.ly/1/extract';

export function extract(url) {
  const key = Meteor.settings.embedlyKey;

  const res = HTTP.get(API_URL, {
    params: {
      key,
      url,
      force: 'true',
    },
  });

  const embedlyData = _.pick(res.data, 'title', 'description');

  if (res.data.images && res.data.images.length > 0) {
    embedlyData.thumbnailUrl = res.data.images[0].url;
  }

  return embedlyData;
}
