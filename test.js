function fact(num) {
    var fact = 1;
    var a = num * 2 - 5;
    if (a > 0) {
        console.log("a is positive");
        return fact;
    }
    // check positive entry
    if (num >= 0) {
        do {
            fact *= num;
            num -= 1;
        } while (num >= 1);
    }
    return fact;
}