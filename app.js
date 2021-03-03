import fs from "fs";
import Excel from "exceljs";
import dotenv from "dotenv";
import Snoowrap from "snoowrap";
import { CommentStream } from "snoostorm";
import { tickers } from "./tickers.js";

dotenv.config();
const workbook = new Excel.Workbook();
const client = new Snoowrap({
  userAgent: "learning bot",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

const writeToExcel = (comment, re) => {
  if (comment.body.includes("$") && comment.body.match(re) !== null) {
    for (const item in comment.body.match(re)) {
      if (!tickers.includes(comment.body.match(re)[item])) return;
      workbook.xlsx
        .readFile("tickers.xlsx")
        .then(() => {
          const worksheet = workbook.getWorksheet(1);
          let written = false;
          worksheet.eachRow({ includeEmpty: true }, (row) => {
            if (row.getCell(1).value === comment.body.match(re)[item]) {
              row.getCell(2).value += 1;
              row.commit();
              written = true;
            }
          });
          if (!written) {
            let lastRow = worksheet.getRow(worksheet.rowCount + 1);
            lastRow.getCell(1).value = comment.body.match(re)[item];
            lastRow.getCell(2).value = 1;
            lastRow.commit();
          }
          written = false;
          return workbook.xlsx.writeFile("tickers.xlsx");
        })
        .then(() => console.log("Data Written"));
    }
  }
};

const excelCheck = () => {
  fs.access("tickers.xlsx", fs.F_OK, (err) => {
    if (err) {
      console.log("tickers.xlsx not found, creating...");
      workbook.addWorksheet("Tickers");
      let row = workbook.getWorksheet(1).getRow(1);
      row.getCell(1).value = "Stock Ticker";
      row.getCell(2).value = "Mentions";
      row.commit();
      workbook.xlsx.writeFile("tickers.xlsx").then(() => {
        console.log("tickers.xlsx created!");
      });
    } else {
      console.log("tickers.xlsx found, continuing...");
    }
  });
};

const tickerCheck = () => {
  excelCheck();
  const re = /\$[A-Z]{1,4}/g;

  const streamOne = new CommentStream(client, {
    subreddit: "wallstreetbets",
    results: 25,
    pollTime: 3000,
  });
  streamOne.on("item", (comment) => {
    writeToExcel(comment, re);
  });

  const streamTwo = new CommentStream(client, {
    subreddit: "RobinHoodPennyStocks",
    results: 25,
    pollTime: 3000,
  });
  streamTwo.on("item", (comment) => {
    writeToExcel(comment, re);
  });

  const streamThree = new CommentStream(client, {
    subreddit: "PennyStocks",
    results: 25,
    pollTime: 3000,
  });
  streamThree.on("item", (comment) => {
    writeToExcel(comment, re);
  });
};

tickerCheck();
