exports.StopWatch = class StopWatch {
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

exports.Rand = class Random {
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