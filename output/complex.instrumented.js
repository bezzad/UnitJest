function fact(num) {
    var fact = 1;
    if (_xa2(num === 0, 0))
        return 1;
    if (_xa2(_xa2(_xa2(num >= 0, 1) && _xa2(fact === 1, 2), 3) && _xa2(num <= 10000, 4), 5)) {
        do {
            _xa2(fact *= num, 6);
            _xa2(num -= 1, 7);
        } while (_xa2(num >= 1, 8));
    } else {
        _xa2(_xa2(console.log, 9)('else node'), 10);
        while (_xa2(this, 11)) {
            if (_xa2(num == 0, 12))
                break;
            else {
                _xa2(num++, 13);
                continue;
            }
        }
    }
    return fact;
}
_xa2(_xa2(exports.fact, 14) = fact, 15);
var testArray = _xa2([], 16);
for (let i = 0; _xa2(i < 100, 17); _xa2(i++, 18)) {
    switch (i) {
    case 0:
        _xa2(_xa2(testArray.push, 19)(1), 20);
        break;
    default:
        _xa2(_xa2(testArray.push, 21)(_xa2(fact(i), 22)), 23);
        break;
    }
}