import { parse } from 'url';
import path from 'path';
import moment from 'moment';
import cheerio from 'cheerio';
import { Vimeo } from 'vimeo';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { EmbedlyAdapter } from 'meteor/drizzle:integrations';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { getScore } from 'meteor/drizzle:util';
import { deleteObject, getSignedUrl, putObject } from 'meteor/drizzle:s3';

import {
  Products,
  ProductUsers,
  ContentWalls,
  ContentWallCharges,
} from 'meteor/drizzle:models';


function getPath(origUrl) {
  let url = parse(origUrl);
  url = url.pathname;
  if (!url.endsWith('/')) {
    url += '/';
  }

  return url;
}

function generateThumbnails(videoUrl, product, wall) {
  const { vimeoToken } = product;

  if (!vimeoToken || !vimeoToken.isConnected || !vimeoToken.accessToken) {
    return;
  }

  const lib = new Vimeo(
    Meteor.settings.Vimeo.clientId,
    Meteor.settings.Vimeo.clientSecret,
    product.vimeoToken.accessToken
  );

  const parsedUrl = parse(videoUrl);
  const videoId = parsedUrl.pathname.replace(/\//g, '');

  const syncRequest = Meteor.wrapAsync(lib.request, lib);

  const videoDetail = syncRequest({
    method: 'GET',
    path: `/videos/${videoId}`,
  });

  const period = videoDetail.duration / 11;

  const thumbnails = [];

  for (let i = 1; i < 11; i++) {
    const thumbnail = syncRequest({
      method: 'POST',
      path: `/videos/${videoId}/pictures`,
      query: {
        time: period * i,
      },
    });

    if (!thumbnail || !thumbnail.sizes || !thumbnail.sizes[0]) {
      return;
    }

    const largestImage = thumbnail.sizes[thumbnail.sizes.length - 1];

    const extName = path.extname(parse(largestImage.link).pathname);
    const fileName = path.basename(parse(largestImage.link).pathname);

    const key = `thumbnails/${wall._id}-${fileName}`;

    const readImage = HTTP.get(largestImage.link, { npmRequestOptions: { encoding: null } });

    const params = {
      Bucket: Meteor.settings.S3bucket,
      ACL: 'public-read',
      Key: key,
      ContentType: `image/${extName.substr(1)}`,
      Body: readImage.content,
    };

    putObject(params);

    const thumbnailUrl = getSignedUrl({
      Bucket: Meteor.settings.S3bucket,
      Key: key,
    });

    const parsedThumbnailUrl = parse(thumbnailUrl);

    thumbnails.push(`https://${parsedThumbnailUrl.host}${parsedThumbnailUrl.pathname}`);
  }

  if (thumbnails.length > 0) {
    ContentWalls.update(wall._id, { $set: {
      'content.thumbnails': thumbnails,
    } });
  }
}

Meteor.methods({
  'contentWall/addUrl'(productId, origUrl) {
    check(productId, String);
    check(origUrl, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    let url = origUrl;
    if (!origUrl.startsWith('http://') && !origUrl.startsWith('https://')) {
      url = `http://${origUrl}`;
    }

    const domain = parse(url).host;
    if (domain !== product.domain) {
      throw new Meteor.Error('invalid-data', 'URL does not match product domain');
    }

    const fullPath = getPath(url);
    const fullUrl = `${domain}${fullPath}`;

    if (ContentWalls.findOne({ url: fullUrl })) {
      throw new Meteor.Error('invalid-data', 'URL duplicated');
    }

    const createdAt = new Date();
    const obj = {
      url: fullUrl,
      price: product.defaultWallPrice || 25,
      productId: product._id,
      createdAt,
      sellCount: 0,
      totalIncome: 0,
      score: getScore(0, createdAt),
    };

    let title;
    try {
      const embedlyData = EmbedlyAdapter.extract(origUrl);

      if (embedlyData.title) {
        obj.title = embedlyData.title;
      }

      if (embedlyData.description) {
        obj.description = embedlyData.description;
      }

      if (embedlyData.thumbnailUrl) {
        obj.thumbnailUrl = embedlyData.thumbnailUrl;
      }
    } catch (e) {
      // pass
    }

    if (!title) {
      try {
        const res = HTTP.get(url);
        if (res.statusCode !== 200) {
          throw new Meteor.Error('');
        }

        const $ = cheerio.load(res.content);

        title = $('title').text() || url;
      } catch (e) {
        // throw new Meteor.Error('wrong-url', `Error while trying access to "${url}"`);
        title = url;
      }
    }

    title = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    title = cheerio('<p/>').html(title).text()
              .replace(/&/g, '&amp;');

    obj.title = title;

    try {
      return ContentWalls.insert(obj);
    } catch (err) {
      if (err.code === 11000) {
        return console.log('Duplicated wall not added.', url);
      }
      throw err;
    }
  },

  'contentWall/saveWallContent'(wallId, content) {
    check(wallId, String);
    check(content, String);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { 'content.original': content } });
  },

  'contentWalls.updateEmbedlyData'(wallId) {
    check(wallId, String);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const url = `http://${wall.url}`;

    const modifier = {};
    try {
      const embedlyData = EmbedlyAdapter.extract(url);

      if (embedlyData.title) {
        modifier.title = embedlyData.title;
      }

      if (embedlyData.description) {
        modifier.description = embedlyData.description;
      }

      if (embedlyData.thumbnailUrl) {
        modifier.thumbnailUrl = embedlyData.thumbnailUrl;
      }

      if (embedlyData.title) {
        embedlyData.title = embedlyData.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        embedlyData.title = cheerio('<p/>').html(embedlyData.title).text()
                  .replace(/&/g, '&amp;');
      }
    } catch (e) {
      if (e.response) {
        throw new Meteor.Error('api-error', JSON.parse(e.response.content).error_message);
      }

      throw e;
    }

    return ContentWalls.update(wallId, { $set: modifier });
  },

  'contentWall/saveWallThumbnail'(wallId, thumbnail) {
    check(wallId, String);
    check(thumbnail, String);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const oldThumb = wall.content && wall.content.thumbnail;

    ContentWalls.update(wallId, { $set: { 'content.thumbnail': thumbnail } });

    if (oldThumb) {
      try {
        deleteObject(oldThumb);
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
      }
    }
  },

  'contentWall/saveVimeoVideoUrl'(wallId, videoUrl) {
    check(wallId, String);
    check(videoUrl, String);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    if (videoUrl && !videoUrl.startsWith('https://vimeo.com')) {
      throw new Meteor.Error('invalid-data', 'Video is not from vimeo');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: {
      'content.vimeoVideoUrl': videoUrl,
    } });

    if (videoUrl) {
      generateThumbnails(videoUrl, product, wall);
    }
  },

  'contentWall/removeUrl'(wallId) {
    check(wallId, String);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.remove(wallId);
  },

  'contentWall/toggleDisabled'(wallId, disabled) {
    check(wallId, String);
    check(disabled, Boolean);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { disabled } });
  },

  'contentWall/toggleAutoDecryption'(wallId, state) {
    check(wallId, String);
    check(state, Boolean);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { autoDecryption: state } });
  },

  'contentWall/toggleViewportConfig'(wallId, state, width) {
    check(wallId, String);
    check(state, Boolean);
    check(width, Number);

    const wall = ContentWalls.findOne(wallId);

    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    return ContentWalls.update(wallId, {
      $set: {
        viewportConfig: {
          disabled: state,
          width,
        },
      },
    });
  },

  'contentWall/toggleFixedPricing'(wallId, state) {
    check(wallId, String);
    check(state, Boolean);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (state) {
      ContentWalls.update(wallId, { $set: { fixedPricing: true } });
    } else {
      ContentWalls.update(wallId, { $unset: { fixedPricing: 1 } });
    }
  },

  'contentWall/toggleVideo'(wallId, state) {
    check(wallId, String);
    check(state, Boolean);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (state) {
      ContentWalls.update(wallId, { $set: { isVideo: true } });
    } else {
      ContentWalls.update(wallId, { $unset: { isVideo: 1 } });
    }
  },

  'contentWall/saveFixedPrice'(wallId, price) {
    check(wallId, String);
    check(price, Number);

    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    if (price < 25 || price > 1000) {
      throw new Meteor.Error('invalid-data', 'Price must be between $0.25 and $10.00');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { fixedPricing: true, price } });
  },

  'contentWall/saveAutoDecryptionConfig'(wallId, config) {
    check(wallId, String);
    check(config, {
      cpm: Number,
      viewCountLimit: Number,
    });

    const wall = ContentWalls.findOne(wallId);
    if (!wall || !wall.autoDecryption) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(wall.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    ContentWalls.update(wallId, { $set: { autoDecryptionConfig: config } });
  },

  'contentWall/dailyStats'(productId, datePeriod) {
    check(productId, String);
    check(datePeriod, {
      beginDate: Date,
      endDate: Date,
    });

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    const incomes = [];
    const dates = {};

    let beginAt = new Date(datePeriod.beginDate);
    let endAt = new Date(datePeriod.beginDate);

    while (moment(endAt).isBefore(datePeriod.endDate)) {
      endAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle

      if (!moment(endAt).isBefore(datePeriod.endDate)) {
        endAt = moment(datePeriod.endDate).add(1, 'seconds')._d; // eslint-disable-line
      }

      incomes.push(0);
      dates[moment(beginAt).format('YYYYMMDD')] = incomes.length - 1;

      beginAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle
    }

    const cursor = ContentWallCharges.find({
      productId,
      createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
      amount: { $gt: 0 },
    });

    cursor.forEach((charge) => {
      const index = dates[moment(charge.createdAt).format('YYYYMMDD')];

      if (index === undefined || incomes[index] === undefined) {
        return;
      }

      incomes[index] += (charge.amount / 100);
    });

    return incomes;
  },

  'contentWalls.getCounts'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    const counts = {
      total: ContentWalls.find({ productId: product._id }).count(),
      enabled: ContentWalls.find({ productId: product._id, disabled: false }).count(),
    };

    return counts;
  },

  'wallCharges.export'(params) {
    check(params, {
      productId: String,
      startDate: Date,
      endDate: Date,
      filter: {
        isRegisteredAtIt: Match.Optional(Boolean), // eslint-disable-line new-cap
        isUnlockedFreeContent: Match.Optional(Boolean), // eslint-disable-line new-cap
        isSubscribed: Match.Optional(Boolean), // eslint-disable-line new-cap
        isUnsubscribed: Match.Optional(Boolean), // eslint-disable-line new-cap
        isMicropaid: Match.Optional(Boolean), // eslint-disable-line new-cap
      },
    });

    const { productId, startDate, endDate, filter } = params;

    const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
    checkOwnerAndSetup({ product, user: Meteor.user() });

    let csv = 'First Name, Last Name,Email,Wall Url,Price,Date\n';

    const filter2 = _.extend(
      { productId, createdAt: { $gte: startDate, $lte: endDate } },
      filter || {}
    );

    ProductUsers.find(filter2).forEach((user) => {
      ContentWallCharges.find({ userId: user.userId }).forEach((charge) => {
        const wall = ContentWalls.findOne({ _id: charge.wallId });
        if (!wall) { return; }

        csv += `${user.firstName || user.name},${user.lastName},${user.email},`;
        csv += `http://${wall.url},${charge.amount && `$${charge.amount / 100}` || 'free'},`;
        csv += `${moment(charge.createdAt).format('DD MMM YYYY')}\n`;
      });
    });

    return csv;
  },
});
