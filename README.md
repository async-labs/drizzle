# Drizzle paywall
Drizzle paywall is a simple, scalable and user-friendly paywall, subscription and membership product for any publisher or online content creator: https://getdrizzle.com. It's built using React, JS, Meteor, Node, MongoDB and is compatible with any web technology and stack. It's implemented natively, not via external JS file. The paywall takes about 30 min to set up and deploy and only 5 min to install it on any type of website. This product is built mainly by @klyburke, @delgermurun and me with contributions from @lnmunhoz. 

![paywall native](https://cloud.githubusercontent.com/assets/10218864/24305592/c3434a72-107a-11e7-8c04-6334a96b6d39.png)


Live example of paywalled content: https://coachesonly.breakingmuscle.com/business-development/how-to-stay-ahead-of-changes-in-personal-training

Live example of publisher's dashboard: https://app.getdrizzle.com/signup

**To help you decide if this product is what you need, read these 2 blog posts:**

1) Part I: https://medium.com/drizzle-blog/how-to-get-more-subscribers-with-a-user-friendly-paywall-part-i-83887372547d#.i3kpg2vaq

2) Part II: https://medium.com/drizzle-blog/how-to-get-more-paying-users-with-user-friendly-paywall-part-ii-8e09766f62eb#.dwv46xnoa

# License

General Public License v3.0. We also offer a commercial license in case you don't want to publicly publish and distribute your code. The commercial license includes extra features (listed below) that particular types of online publishers would need, for example a metered paywall.

If instead of selling content, you're interested in detecting Adblock users and recovering ad revenue, check out our Adblock detector at this repo: https://github.com/tima101/Native-adblock-detector

# Who this product is built for:
- any publisher with premium content and who believes that advertising revenue should be supplemented with direct revenue;
- any startup which sells premium content, digital products (example, videos), or premium features;
- any website owner who has premium, valuable, unique content and wants to sell it via membership and subscriptions.

# Why this product exists:
The majority of online publishers and content creators need an alternative revenue model as online advertising keeps declining. Many have great content that people are willing to pay for, but they don't have a simple way to put up a paywall or their current paywall is too diffcult to encourage users to pay. We've made this paywall easy to use on any type of website, and we've made the process of signing up and paying as seamless as possible.

For more on ad revenue and why publishers must find alternative revenue sources, read:
- Why Medium ditched ad-based business model and launches subscriptions: https://medium.com/@getdrizzle/subscriptions-on-medium-f23de6677464#.92s0vj4xa

- Why online ad revenue is declining: https://medium.com/@getdrizzle/big-shifts-in-online-content-monetization-bdebd920bf4b#.oyjvxcqif

- Why it's so hard for ad-supported business to pivot: 
https://medium.com/@getdrizzle/challenges-for-content-monetization-7a1b813ba19d#.wr3ousv2o


# Features
### Open-source license (this repo)
- Email and Facebook signup and login. Email verification.
- Payments, subscriptions, refunds via Stripe.
- User-friendly paywall. Login with 2 clicks, pay with 2 clicks. Screenshots: https://medium.com/@getdrizzle/how-to-get-more-subscribers-with-a-user-friendly-paywall-part-i-83887372547d#.g0sx8k3km
- Paywalled data is secure by hiding via server-side method, not client-side.
- Paywall is server-side rendered.
- Mobile-optimized.
- Content performance metrics. See detailed analytics of user engagement on every web page with paywalled content:
![screen shot 2017-03-18 at 11 39 01 am](https://cloud.githubusercontent.com/assets/10218864/24074929/93ad21de-0bcf-11e7-98a8-c9e01b9ccd98.png)
- Complete membership management. Get detailed analytics for every user and how he/she engages with your content. Segments users who are in each stage of your subscription sales funnel:
![screen shot 2017-03-18 at 11 40 12 am](https://cloud.githubusercontent.com/assets/10218864/24074944/af9c9348-0bcf-11e7-8969-c59ac1a39b3d.png)
- Payments and Payouts analytics.
- One-click refunds.
- Stripe integration.
- Customizable UI.
- Social proof. Show how many people have purchased your content to encourage others to sign up.
- Content recommendations below each paywall. Curated lists include: Newest content, Popular content.
- Content search. User search. Search by date. 
- Column sorting to identify best performing content.
- Content categories.
- Settings for individual pages.
- Footer bar and in-site links.
- Mailgun and Mailchimp integration.
- Set up a custom welcome email to new signups. 
- Send email notifications to any group of users.
- Send a custom email to individual user.
- Send a custom email to group of users.
- Group users by stage in sales funnel.
- Set up single payments.
- Set up monthly subscriptions.
- Set up a Free Trial offer for subscriptions.
- Ability to create single sign-on system accross multiple websites.
- Set up on Wordpress or Drupal site with our plugin or module (via API key).

### Commercial license
- Set up on Wordpress or Drupal with our plugin or module
- Paywall videos
- Metered paywall
- Lead generation (ask for verified email address instead of a payment to access content)
- Daily pass
- Additional content recommendations below each paywall. Curated lists: Trending content, Similar content.
- Referral program
- Discount code for subscriptions
- Annual and Weekly subscriptions
- Section-specific subscriptions
- Export user data

# Setup of Publishers app (./publishers)
In my local build, I use node v5.7.0 and npm 3.8.2 inside all apps.
To set node version:

```
. ~/.nvm/nvm.sh
nvm use 5.7.0
```

Publishers app is the dashboard where the publisher or website owner sets up subscription plans, monitors content performance, and monitors user payments.

In main folder, run:

```
npm install
```

In ./publishers folder, run:

```
meteor npm install
meteor npm install --save bcrypt
```

Create local-settings.json file, example:

```
{
    "AWSAccessKeyId": "AKIAIVxxxxxxxxxxxxxxxxxxxxxxx",
    "AWSSecretAccessKey": "+BaPedgw1uyb0Exxxxxxxxxxxxxxxxxxxxxxx",
    "S3bucket": "zenmarket",
    "embedlyKey": "e40b9936xxxxxxxxxxxxxxxxxxxxxxx",
    "private": {
    },
    "public": {
    }
}
```
Publishers app can be started locally by:

```
./start-local.sh
```
Publishers app uses remote demo MongoDB. Feel free to specify local or remote MONGO_URL in the start-local.sh file.
Example of deployed Publishers app can be found here: https://app.getdrizzle.com/

When you start the app for the first time, DB will be seeded by a few documents: Admin user will be created (**users** collection), website (**products** collection) and paywalled page (**payg_content_walls** collection).

App will be running at `http://localhost:8021/` To find email and password of your Admin user, go to:
`./publishers/imports/startup/server/seeds.js`

You will log in and revisit http://localhost:8021/setup page after we are done with setting up Users apps.

![screen shot 2017-03-27 at 10 22 26 am](https://cloud.githubusercontent.com/assets/10218864/24368977/61b353ec-12d7-11e7-9ae1-39b68473e760.png)



# Setup of Users apps (./users/..)

Remember to set up the right node version, or later on gulp it won't run.

In ./users folder, run:

```
./setup.sh
```

After it's done, make sure that ./users/widgetFile contains settings.json file:
```
{
  "API_URL": "http://localhost:8051"
}
```

In ./users/widget folder, create local-settings.json:
```
{
  "PUBLISHER_ROOT_URL": "http://localhost:8021"
}
```
And run:

```
meteor npm install --save bcrypt
```

To start 2 Users apps (Widget app at http://localhost:8051 and static Publisher app at http://localhost:8060), run 

```
./start-local.sh
```
inside ./users folder. This will also run gulpfile.js, so widget.js file at ./users/widgetFile/src/widget.js and ./publishers/private/widget.js is updated without app restart.

Static Publisher app at http://localhost:8060 is a static website with paywalled content on the homepage.

# Setup of paywall on local website (./users/publisher)

Go to http://localhost:8021/login, log in with your Admin user. Go to http://localhost:8021/setup page. Copy setup code, and paste it at the bottom of ./users/publisher/index.html.

Navigate to http://localhost:8060, you should see: 

![screen shot 2017-03-18 at 6 36 32 pm](https://cloud.githubusercontent.com/assets/10218864/24077416/e6bb4de4-0c09-11e7-8793-0282af325deb.png)

![screen shot 2017-03-18 at 6 36 46 pm](https://cloud.githubusercontent.com/assets/10218864/24077420/ec05130c-0c09-11e7-83b1-c3fa9e082936.png)

To see blue footer bar with call-to-action, go to http://localhost:8021/wall-settings and **Enable call to action footer bar**.

# Deploy
You will need to deploy 2 apps: Publishers app ( ./publishers) and Widget app (./users/widget). Here is a detailed description for deployment of Meteor apps with mupx tool: https://github.com/tima101/meteor-deploy-letsencrypt

# Future and Contributions
This section will need more work. The next 3 steps for this open-source project:
- Improve UI and UX on Publishers app (./publishers).
- Meteor 1.5 to reduce initial bundle size for Widget app (./users/widget).
- Add Apple pay for easier payments on Mobile.
- Add client-side paywalling in addition to server-side.

