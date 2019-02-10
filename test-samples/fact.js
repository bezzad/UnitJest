fact = function (num) {
    if (num < 0)
        return 0;
    if (num == 0) {
        return 1;
    }

    let fact = 1
    do {
        fact *= num; num -= 1
    } while (num >= 1); return fact;
}
// export fact as module
// module.exports = fact;