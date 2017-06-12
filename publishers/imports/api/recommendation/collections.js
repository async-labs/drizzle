/* globals RelatedUrls */

import { Mongo } from 'meteor/mongo';

export const RelatedUrls = new Mongo.Collection('related_urls');

global.RelatedUrls = RelatedUrls;
