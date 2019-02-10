
function run(num) {
    let path = [];
    function ___covC(id) {
        path.push(id);
    }
    ___covC(4);
    fact = function (num) {
        if (___covC(7) && num < 0) {
            ___covC(8);
            return 0;
        }
        if (___covC(9) && num == 0) {
            ___covC(10);
            return 1;
        }
        ___covC(11);
        let fact = 1;
        do {
            ___covC(12);
            fact *= num;
            ___covC(15);
            num -= 1;
        } while (___covC(13) && num >= 1);
        ___covC(14);
        return fact;
    };
    return {
        value: fact(num),
        path
    };
}