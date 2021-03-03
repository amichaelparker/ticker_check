# ticker_check
Create an application on Reddit (developer settings under your user settings).

After you create the app, `yarn install` and then create an .env file that looks like this:

```
CLIENT_ID=YourAppID
CLIENT_SECRET=YourAppSecret
REDDIT_USER=UsernameForAppAccount
REDDIT_PASS=PasswordForAppAccount
```

Run with `babel-node app.js`. You can add more subreddits by copy/pasting this code (and editing appropriately):

```javascript
const streamOne = new CommentStream(r, { subreddit: "wallstreetbets", results: 25, pollTime: 3000 });
streamOne.on("item", comment => {
    writeToExcel(comment, re, ignore);
})
```

I made this in about an hour and am not well versed in Reddit's rate limits so... keep that in mind.