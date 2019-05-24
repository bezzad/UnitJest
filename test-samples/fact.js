/**
 * return factoial of num number
 * @param {!number} num A non nullable number value.
 * @return {!number} the result of num factorial.
 */
module.exports = function fact(num) {
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