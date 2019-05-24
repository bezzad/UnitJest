var doctrine = require("doctrine"); // JSDoc parsing

module.exports = function parse(src) {
    return doctrine.parse(src, { unwrap: true, sloppy: true });
};