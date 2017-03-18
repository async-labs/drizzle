import { ContentWalls } from 'meteor/drizzle:models';
import cheerio from 'cheerio';

import { HTTP } from 'meteor/http';
import { SyncedCron } from 'meteor/percolate:synced-cron';

function checkEmbedCode() {
  const walls = ContentWalls.find(
    { disabled: false },
    { fields: { url: 1 } }
  ).fetch();

  walls.forEach((wall) => {
    let isInstalled;

    try {
      const response = HTTP.get(`http://${wall.url}`);
      const $ = cheerio.load(response.content);

      const wrapper = $('#zenmarket--wrapper');
      isInstalled = wrapper.length > 0;
    } catch (e) {
      isInstalled = false;
    }

    const modifier = { $set: { isEncryptedContentIntalled: isInstalled } };
    if (!isInstalled) {
      modifier.$set.isActive = false;
    }

    ContentWalls.update(wall._id, modifier);
  });
}

SyncedCron.add({
  name: 'Check embed code',
  schedule(parser) {
    // return parser.text('every 30 seconds');
    return parser.text('every 1 hour');
  },
  job() {
    checkEmbedCode();
  },
});
