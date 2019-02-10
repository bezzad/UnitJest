function fact(num) {
    let fact = 1;
    do {
        fact *= num;
        num -= 1;
    } while (num >= 1);
    return fact;
}
// export fact as module
module.exports = fact;