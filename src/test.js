function fact(num) {
    var fact = 1;

    // check positive entry
    if (num >= 0) {
        do {
            fact *= num;
            num -= 1;
        } while (num >= 1);
    }
    return fact;
}