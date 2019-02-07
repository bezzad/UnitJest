function fact(num) {
    var fact = 1;
    if (_s1m(num === 0, 0))
        return 1;
    if (_s1m(_s1m(_s1m(num >= 0, 1) && _s1m(fact === 1, 2), 3) && _s1m(num <= 10000, 4), 5)) {
        do {
            _s1m(fact *= num, 6);
            _s1m(num -= 1, 7);
        } while (_s1m(num >= 1, 8));
    } else {
        _s1m(_s1m(console.log, 9)('else node'), 10);
        while (_s1m(this, 11)) {
            if (_s1m(num == 0, 12))
                break;
            else {
                _s1m(num++, 13);
                continue;
            }
        }
    }
    return fact;
}
_s1m(_s1m(exports.fact, 14) = fact, 15);
var testArray = _s1m([], 16);
for (let i = 0; _s1m(i < 100, 17); _s1m(i++, 18)) {
    switch (i) {
    case 0:
        _s1m(_s1m(testArray.push, 19)(1), 20);
        break;
    default:
        _s1m(_s1m(testArray.push, 21)(_s1m(fact(i), 22)), 23);
        break;
    }
}