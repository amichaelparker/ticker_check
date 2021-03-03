# ticker_check
This is a simple toy app I built to gather stock symbol 'sentiment' from Reddit. It grabs the symbols from comments,
and adds them to an Excel spreadsheet, along with the number of mentions for each. This is for informational purposes only;
if you use it to yolo options and put yourself in the poor house:

1. I am not responsible
2. Have the courtesy to go to r/wallstreetbets and post the loss porn so they know you belong.

# Usage
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