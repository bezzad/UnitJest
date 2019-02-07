var fibcache = {};
// fast Fibonacci 
function fib(i) {
    let t;
    switch (i) {
        case 0:
        case 1:
            return 1;
        default:
            if (fibcache[i]) {
                return fibcache[i];
            }
            else {
                t = fib(i - 1);
                fibcache[i] = t + fib(i - 2)
                return fibcache[i];
            };
    };
}; 