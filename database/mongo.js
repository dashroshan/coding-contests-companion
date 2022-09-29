const contestSchema = require('./schema/contest.js');
const channelSchema = require('./schema/channel.js');

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

// Delete the finished contests from the db
module.exports.deleteFinishedContests = async function () {
    await contestSchema.deleteMany({ end: { $lte: Math.floor(Date.now() / 1000) } });
}

// Save channel where notifications would be sent by the bot
module.exports.saveChannel = async function (server, channel, role) {
    await channelSchema.findOneAndUpdate(
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

// Get all channels opted in for receiving the notifications
module.exports.getChannels = async function () {
    let channels = await channelSchema.find({});
    return channels;
}

// Delete a saved channel by channel id
// Used when the bot is unable to send a message in the channel
module.exports.deleteChannel = async function (channelID) {
    await channelSchema.deleteOne({ channel: channelID });
}

// Delete a saved channel by its server id
// Used by the notifications-stop command
module.exports.deleteSever = async function (serverID) {
    const resp = await channelSchema.deleteOne({ server: serverID });
    return resp.deletedCount;
}