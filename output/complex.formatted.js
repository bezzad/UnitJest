function fact(num) {
    var fact = 1;
    do {
        fact *= num;
        num -= 1;
    } while (num >= 1);
    return fact;
}
exports.fact = fact;