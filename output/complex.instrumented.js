function fact(num) {
    var fact = 1;
    if (_ro3(num === 0, 0))
        return 1;
    if (_ro3(_ro3(_ro3(num >= 0, 1) && _ro3(fact === 1, 2), 3) && _ro3(num <= 10000, 4), 5)) {
        do {
            _ro3(fact *= num, 6);
            _ro3(num -= 1, 7);
        } while (_ro3(num >= 1, 8));
    } else {
        _ro3(_ro3(console.log, 9)('else node'), 10);
        while (_ro3(this, 11)) {
            if (_ro3(num == 0, 12))
                break;
            else {
                _ro3(num++, 13);
                continue;
            }
        }
    }
    return fact;
}
_ro3(_ro3(exports.fact, 14) = fact, 15);
var testArray = _ro3([], 16);
for (let i = 0; _ro3(i < 100, 17); _ro3(i++, 18)) {
    switch (i) {
    case 0:
        _ro3(_ro3(testArray.push, 19)(1), 20);
        break;
    default:
        _ro3(_ro3(testArray.push, 21)(_ro3(fact(i), 22)), 23);
        break;
    }
}