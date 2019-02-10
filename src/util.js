const escodegen = require('escodegen'); // https://github.com/estools/escodegen

const regenerateOpt = {
    format: {
        indent: {
            style: "    ", // Indent string. Default is 4 spaces ('    ').
            base: 0, // Base indent level.
            adjustMultilineComment: true // Adjust the indentation of multiline comments to keep asterisks vertically aligned.
        }, // The indent options
        newline: "\n", // New line string. Default is '\n'.
        space: " ", // White space string. Default is standard ' ' (\x20).
        json: true, // Enforce JSON format of numeric and string literals. This option takes precedence over option.format.hexadecimal and option.format.quotes.
        renumber: true, // Try to generate shorter numeric literals than toString() (9.8.1)
        hexadecimal: true, // Generate hexadecimal a numeric literal if it is shorter than its equivalents. Requires option.format.renumber.
        quotes: "double", // Delimiter to use for string literals. Accepted values are: 'single', 'double', and 'auto'. When 'auto' is specified, escodegen selects a delimiter that results in a shorter literal.
        escapeless: false, // Escape as few characters in string literals as necessary.
        compact: false, //  Do not include superfluous whitespace characters and line terminators.
        semicolons: true, // Preserve semicolons at the end of blocks and programs.
        parentheses: true, // Preserve parentheses in new expressions that have no arguments.
        safeConcatenation: true,
        preserveBlankLines: true
    },
    comments: true
};

/**
 * Produces given Abstract Syntax Tree as javascript code
 * @param ast The Abstract Syntax Tree to generate code from
 * @param opt The generation options
 */
function generate(ast, opt) {
    opt = opt || regenerateOpt;
    return escodegen.generate(ast, opt);
}

class StopWatch {
    static start() {
        this.startTime = new Date().getTime();
    }

    static stop() {
        let duration = new Date().getTime() - this.startTime;
        if (duration > 5000)
            console.log('duration:', duration / 1000, "sec");
        else
            console.log('duration:', duration, "ms");
    }
}

class Random {
    constructor(min, max) {
        this.min = min || 0;
        this.max = max || 0;
        this.prev = null;
    }

    next() {
        let num = Math.floor((Math.random() * (this.max - this.min + 1)) + this.min);
        this.prev = (num === this.prev && this.min !== this.max) ? this.next() : num;
        return this.prev;
    };
}


String.prototype.insert = function (index, value) {
    return this.slice(0, index) + value + this.slice(index);
}

module.exports = { Random, StopWatch, generate };