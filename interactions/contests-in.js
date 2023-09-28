const contestsInPaginate = require("../utility/contests-in");

async function contestsInPaginateWrap(interaction) {
    await contestsInPaginate(interaction, false);
}

module.exports = contestsInPaginateWrap;