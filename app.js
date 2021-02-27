const fs = require('fs');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
require('dotenv').config();
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const { CommentStream } = require("snoostorm");

const r = new Snoowrap({
    userAgent: 'learning bot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS,
    requestDelay: 500
});

async function writeToExcel(comment, re, ignore) {
    if (comment.body.includes('$')) {
        if (comment.body.match(re) !== null) {
            for (const item in comment.body.match(re)) {
                if (ignore.indexOf(comment.body.match(re)[item]) !== -1) return;
                workbook.xlsx.readFile('tickers.xlsx').then(() => {
                    const worksheet = workbook.getWorksheet(1);
                    let written;
                    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        if (row.getCell(1).value === comment.body.match(re)[item]) {
                            row.getCell(2).value += 1;
                            row.commit();
                            written = true;
                        }
                    });
                    if (!written) {
                        let row = worksheet.getRow(worksheet.rowCount + 1);
                        row.getCell(1).value = comment.body.match(re)[item];
                        row.getCell(2).value = 1;
                        row.commit();
                    };
                    written = false;
                    return workbook.xlsx.writeFile('tickers.xlsx')
                }).then(() => console.log('Writing Data'));
            }
        }
    }
}

const excelCheck = () => {
    fs.access('tickers.xlsx', fs.F_OK, (err) => {
        if (err) {
            console.log('tickers.xlsx not found, creating...');
            workbook.addWorksheet('Tickers');
            let row = workbook.getWorksheet(1).getRow(1);
            row.getCell(1).value = 'Stock Ticker';
            row.getCell(2).value = 'Mentions';
            row.commit();
            workbook.xlsx.writeFile('tickers.xlsx').then(() => {
                console.log('tickers.xlsx created!');
            });
        }
        else {
            console.log('tickers.xlsx found, continuing...');
        }
    })
}

const tickerCheck = () => {
    const re = /\$[A-Z]{1,4}/g;
    const ignore = ['$ANUS', '$ROPE', '$G', '$J', '$M', '$P', '$U'];

    excelCheck();

    const streamOne = new CommentStream(r, { subreddit: "wallstreetbets", results: 25 });
    streamOne.on("item", async (comment) => {
        await writeToExcel(comment, re, ignore);
    })

    const streamTwo = new CommentStream(r, { subreddit: "RobinHoodPennyStocks", results: 25 });
    streamTwo.on("item", async (comment) => {
        await writeToExcel(comment, re, ignore);
    })

    const streamThree = new CommentStream(r, { subreddit: "PennyStocks", results: 25 });
    streamThree.on("item", async (comment) => {
        await writeToExcel(comment, re, ignore);
    })
}

tickerCheck();