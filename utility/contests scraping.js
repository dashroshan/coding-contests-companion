const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const puppeteer = require("puppeteer");
const headers = { 'headers': { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' } };

// Get contests from CodeChef
async function codeChef() {
    const res = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all', headers)
    const futureContests = [...res.data["future_contests"], ...res.data["present_contests"]];
    let processedData = futureContests.map(c => {
        let name = c["contest_name"];
        let url = "https://www.codechef.com/" + c["contest_code"]
        let start = Math.floor((new Date(c["contest_start_date_iso"])).getTime() / 1000);
        let duration = parseInt(c["contest_duration"], 10) * 60;
        return { name, url, start, duration };
    });
    return processedData;
}

// Get contests from LeetCode
async function leetCode() {
    const res = await axios.get('https://leetcode.com/graphql?query={%20allContests%20{%20title%20titleSlug%20startTime%20duration%20__typename%20}%20}', headers)
    const futureContests = res.data["data"]["allContests"].filter((e) => ((e["startTime"] + e["duration"]) > Math.floor(Date.now() / 1000)));
    let processedData = futureContests.map(c => {
        let name = c["title"];
        let url = "https://leetcode.com/contest/" + c["titleSlug"]
        let start = c["startTime"];
        let duration = c["duration"];
        return { name, url, start, duration };
    });
    return processedData;
}

// Get contests from HackerRank
async function hackerRank() {
    const res = await axios.get('https://www.hackerrank.com/rest/contests/upcoming?limit=10', headers)
    const futureContests = res.data["models"].filter((e) => (e["epoch_endtime"] > Math.floor(Date.now() / 1000)));
    let processedData = futureContests.map(c => {
        let name = c["name"];
        let url = "https://www.hackerrank.com/contests/" + c["slug"]
        let start = c["epoch_starttime"];
        let duration = c["epoch_endtime"] - c["epoch_starttime"];
        return { name, url, start, duration };
    });
    return processedData;
}

// Get contests from CodeForces
async function codeForces() {
    const res = await axios.get('https://codeforces.com/api/contest.list', headers)
    const futureContests = res.data["result"].filter(e => (e["phase"] === "BEFORE" || e["phase"] === "CODING"));
    let processedData = futureContests.map(c => {
        let name = c["name"];
        let url = "https://codeforces.com/contest/" + c["id"];
        let start = c["startTimeSeconds"];
        let duration = c["durationSeconds"];
        return { name, url, start, duration };
    });
    return processedData;
}

// Get contests from AtCoder
async function atCoder() {
    const res = await axios.get('https://atcoder.jp/contests', headers);
    const dom = new JSDOM(res.data);
    const active = (dom.window.document.getElementById('contest-table-action'));
    const upcoming = (dom.window.document.getElementById('contest-table-upcoming'));

    let array = [];
    function addToArray(row) {
        const epochtime = Date.parse(new Date(row.cells[0].lastChild.firstChild.innerHTML));
        if (Number.isNaN(epochtime)) return; // Exit if start time isn't valid

        const link = row.cells[1].querySelector('a');
        const url = 'https://atcoder.jp' + link.href;
        const durstring = row.cells[2].innerHTML.split(':');
        const duration = durstring[0] * 3600 + durstring[1] * 60;

        array.push({ name: link.innerHTML, url: url, start: Math.floor(epochtime / 1000), duration: duration });
    }

    if (active) active.querySelectorAll('table tr').forEach(row => addToArray(row));
    if (upcoming) upcoming.querySelectorAll('table tr').forEach(row => addToArray(row));

    return Array.from(array);
}

// Get contests from Google KickStart
async function kickStart() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://codingcompetitions.withgoogle.com/kickstart/schedule')
    await page.waitForSelector('.schedule-row')
    const processedData = await page.evaluate(() => {
        const upComing = Array.from(document.body.querySelectorAll(".schedule-row.schedule-row__upcoming"))
        let array = []
        upComing.forEach(contest => {
            let allCells = Array.from(contest.children)
            let data = allCells.map(
                eachCell =>
                    eachCell.children[0].href ? eachCell.children[0].href : eachCell.children[0].innerHTML
            )
            const name = data[0]
            const startDateUTC = data[1] + " UTC"
            const start = new Date(startDateUTC).getTime() / 1000
            const url = data[4]
            const duration = (data[3].split(" ")[0]) * 3600
            array.push({ name, url, start, duration })
        })
        return array
    })
    await browser.close()
    return processedData
}

// Get contests from HackerEarth
async function hackerEarth() {
    const res = await axios.get('https://www.hackerearth.com/chrome-extension/events', headers);
    const futureContests = res.data.response.filter(c => {
        const endtime = new Date(c["end_utc_tz"]);
        return Math.floor(endtime.getTime() / 1000) > Math.floor(Date.now() / 1000)
    });
    let processedData = futureContests.map(c => {
        const endTimeSeconds = new Date(c["end_utc_tz"]).getTime() / 1000;
        const startTimeSeconds = new Date(c["start_utc_tz"]).getTime() / 1000;
        let name = c["title"];
        let url = c["url"];
        let start = startTimeSeconds;
        let duration = endTimeSeconds - startTimeSeconds;
        return { name, url, start, duration };
    });
    return processedData;
}

// Save new contests to the db and delete the finished ones
async function contests(db) {
    await db.saveContests('codechef', await codeChef());
    await db.saveContests('leetcode', await leetCode());
    await db.saveContests('hackerrank', await hackerRank());
    await db.saveContests('codeforces', await codeForces());
    await db.saveContests('atcoder', await atCoder());
    await db.saveContests('hackerearth', await hackerEarth());
    await db.saveContests('kickstart', await kickStart());
    await db.deleteFinishedContests();
}

// If scraping fails for some reason, increase the delay until next try by 10
// times to avoid spamming the server and being rate limited
let retryWait = 5000;
async function updateContestsLoop(db) {
    try {
        await contests(db);
        retryWait = 5000;
    } catch (error) {
        console.log("Scraping failed: " + error);
        console.log(`Retrying to scrape after ${Math.floor(retryWait / 1000)} seconds...`);
        setTimeout(async () => {
            console.log("Retrying to scrape...");
            retryWait *= 10;
            await updateContestsLoop(db);
        }, retryWait);
    }
}

// Run the notify function once on load, and then every 1 hour
async function updateContests(db) {
    console.log("Scraping loop started.");
    await updateContestsLoop(db);
    setInterval(async () => {
        await updateContestsLoop(db);
    }, 3600000);
}

module.exports = updateContests;