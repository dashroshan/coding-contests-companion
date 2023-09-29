const contestSchema = require('./schema/contest.js');
const configurationSchema = require('./schema/configuration.js');
const contestChannelSchema = require('./schema/contestChannel.js');
const problemChannelSchema = require('./schema/problemChannel.js');

// Save contests from the data array as individual documents for the given platform
module.exports.saveContests = async function (platform, data) {
    for (d of data) {
        // If a contest with the url exists, ignore it. This makes the query
        // insert only the new contests not already in the db
        await contestSchema.findOneAndUpdate(
            { url: d.url },
            {
                $setOnInsert: {
                    name: d.name,
                    url: d.url,
                    start: d.start,
                    end: (d.start + d.duration),
                    duration: d.duration,
                    platform: platform,
                    notified: (d.start < Math.floor(Date.now() / 1000)),
                }
            },
            { upsert: true }
        );
    }
}

// Return an array of contests sorted by their starting date for the given platform
module.exports.getPlatformContests = async function (platform) {
    let contests = await contestSchema.find({ platform: platform, end: { $gte: Math.floor(Date.now() / 1000) } })
    contests.sort((a, b) => (a.start - b.start));
    return contests;
}

// Return an array of contests which start within an hour whose notifications
// haven't been sent yet, and then set their notified property to true
module.exports.getContestsStartingSoon = async function () {
    let contests = await contestSchema.find({ notified: false, start: { $lte: (Math.floor(Date.now() / 1000) + 3600) } });
    await contestSchema.updateMany(
        { notified: false, start: { $lte: (Math.floor(Date.now() / 1000) + 3600) } },
        { $set: { notified: true } }
    );
    return contests;
}

module.exports.getNextXContests = async function (x) {
    let contests = await contestSchema.find({ notified: false }).sort({ start: 1 }).limit(x);
    return contests;
}

// Return an array of contests which start in coming X days
module.exports.getContestsStartingInXDays = async function (days) {
    let contests = await contestSchema
        .find({ start: { $lte: (Math.floor(Date.now() / 1000) + days * 86400), $gte: Math.floor(Date.now() / 1000) } })
        .sort({ start: 1 });
    return contests;
}

// Delete the finished contests from the db
module.exports.deleteFinishedContests = async function () {
    await contestSchema.deleteMany({ end: { $lte: Math.floor(Date.now() / 1000) } });
}

// Save channel where contest notifications would be sent by the bot
module.exports.saveContestChannel = async function (server, channel, role) {
    await contestChannelSchema.findOneAndUpdate(
        { server: server },
        {
            $set: {
                channel: channel,
                roleToPing: role
            }
        },
        { upsert: true, new: true }
    );
}

// Save channel where daily problems would be sent by the bot
module.exports.saveProblemChannel = async function (server, channel) {
    await problemChannelSchema.findOneAndUpdate(
        { server: server },
        {
            $set: {
                channel: channel
            }
        },
        { upsert: true, new: true }
    );
}

// Get all channels opted in for receiving the contest notifications
module.exports.getContestChannels = async function () {
    let channels = await contestChannelSchema.find({});
    return channels;
}

// Get all channels opted in for receiving the daily problems
module.exports.getProblemChannels = async function () {
    let channels = await problemChannelSchema.find({});
    return channels;
}

// Delete a saved channel by channel id for contest notifications
// Used when the bot is unable to send a message in the channel
module.exports.deleteContestChannel = async function (channelID) {
    await contestChannelSchema.deleteOne({ channel: channelID });
}

// Delete a saved channel by channel id for daily problems
// Used when the bot is unable to send a message in the channel
module.exports.deleteProblemChannel = async function (channelID) {
    await problemChannelSchema.deleteOne({ channel: channelID });
}

// Delete a saved channel by its server id
// Used by the stop command for contest notifications
module.exports.deleteContestServer = async function (serverID) {
    const resp = await contestChannelSchema.deleteOne({ server: serverID });
    return resp.deletedCount;
}

// Delete a saved channel by its server id
// Used by the stop command for daily problems
module.exports.deleteProblemServer = async function (serverID) {
    const resp = await problemChannelSchema.deleteOne({ server: serverID });
    return resp.deletedCount;
}

// Set last daily problem sent day to today
module.exports.setLastDailyProblem = async function () {
    const day = (new Date()).getUTCDate();
    await configurationSchema.findOneAndUpdate(
        { name: 'config' },
        {
            $set: {
                lastDailyProblem: day
            }
        },
        { upsert: true, new: true }
    );
}

// Get last daily problem sent day
module.exports.getLastDailyProblem = async function () {
    let config = await configurationSchema.findOne({ name: 'config' });
    if (!config) return -1;
    return config.lastDailyProblem;
}