
function fact(num) {
    let fact = 1;
    do {
        fact *= num;
        num -= 1;
    } while (num >= 1);
    return fact;
}
module.exports = fact;