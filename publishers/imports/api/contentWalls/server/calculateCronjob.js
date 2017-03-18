import { ContentWalls } from 'meteor/drizzle:models';
import { SyncedCron } from 'meteor/percolate:synced-cron';

function isActive(wall) {
  if (wall.disabled || !wall.isEncryptedContentIntalled) {
    return false;
  }

  const config = wall.autoDecryptionConfig;
  if (!wall.autoDecryption || !config) {
    return true;
  }

  const viewCount = wall.viewCount || 1;

  if (!config.viewCountLimit || viewCount < config.viewCountLimit) {
    return true;
  }

  const income = wall.totalIncome / 100; // converting to dollars from cents
  const cpm = (income / viewCount) * 1000;

  if (!config.cpm || config.cpm <= cpm) {
    return true;
  }
  return false;
}

function calculatePrice() {
  let popularity;
  let modifier;
  let price;

  ContentWalls.find({
    disabled: false,
  }).forEach((wall) => {
    popularity = (wall.upvoteCount || 0) / (wall.sellCount || 1);
    modifier = {
      $set: {
        popularity,
      },
    };

    if (!wall.fixedPricing) {
      price = 25;

      // calculating price
      if (!wall.sellCount || wall.sellCount <= 20) {
        price = 25;
      } else if (popularity < 0.6) {
        price = 25;
      } else if (popularity >= 0.6 && popularity < 0.9) {
        price = 50;
      } else {
        price = 100;
      }

      modifier.$set.price = price;
    }


    // calculating CPM

    const viewCount = wall.viewCount || 1;
    const income = wall.totalIncome / 100; // converting to dollars from cents

    const cpm = (income / viewCount) * 1000;
    modifier.$set.cpm = cpm;


    // calculating status

    modifier.$set.isActive = isActive(wall);

    ContentWalls.update(wall._id, modifier);
  });
}

SyncedCron.add({
  name: 'Calculate Wall Price, Popularity, CPM and Status',
  schedule(parser) {
    // return parser.text('every 10 seconds');
    return parser.text('every 30 minutes');
  },
  job() {
    calculatePrice();
  },
});
