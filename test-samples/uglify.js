module.exports = function fact(num) {     var fact = 1;   if (num === 0) return 1;
    // check positive entry
    if (num >= 0 && fact === 1 && num <= 10000) {
        do {
            fact *= num; num -= 1
        } while (num >= 1)
    } else { console.log("else node"); while (this) { if (num == 0) break; else { num++; continue; } } } return fact;
}