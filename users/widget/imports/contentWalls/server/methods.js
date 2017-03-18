import { parse } from 'url';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ContentWalls } from 'meteor/drizzle:models';
import { getPath } from '/imports/products';

export const callToActionClicked = new ValidatedMethod({
  name: 'contentWalls.callToActionClicked',
  validate: new SimpleSchema({
    wallId: { type: String },
  }).validator(),

  run({ wallId }) {
    this.unblock();

    const conn = this.connection;
    const callToActionClickedWalls = conn.call_To_Action_Clicked_Walls || {};
    if (!callToActionClickedWalls[wallId]) {
      const modifier = { callToActionClickedCount: 1 };
      ContentWalls.update(wallId, { $inc: modifier });

      callToActionClickedWalls[wallId] = 1;
      conn.call_To_Action_Clicked_Walls = callToActionClickedWalls;
    }
  },
});

export const footerButtonClicked = new ValidatedMethod({
  name: 'contentWalls.footerButtonClicked',
  validate: new SimpleSchema({
    wallId: { type: String },
  }).validator(),

  run({ wallId }) {
    this.unblock();

    const conn = this.connection;
    const footerButtonClickedWalls = conn.footer_button_Clicked_Walls || {};
    if (!footerButtonClickedWalls[wallId]) {
      const modifier = { footerButtonClickedCount: 1 };
      ContentWalls.update(wallId, { $inc: modifier });

      footerButtonClickedWalls[wallId] = 1;
      conn.footer_button_Clicked_Walls = footerButtonClickedWalls;
    }
  },
});

export const clickedOnUpsellingLink = new ValidatedMethod({
  name: 'contentWalls.clickedOnUpsellingLink',
  validate: new SimpleSchema({
    wallId: { type: String },
    url: { type: String },
  }).validator(),

  run({ wallId, url }) {
    const path = getPath(url);
    const fullUrl = `${parse(url).host}${path}`;

    ContentWalls.update({ url: fullUrl }, { $inc: { visitedCountViaUpselling: 1 } });
    ContentWalls.update(wallId, { $inc: { upsellingClickedCount: 1 } });
  },
});
