function getIntegerRandom(min, max) {
    let prev;
    return function rand() {
        const num = Math.floor((Math.random() * (max - min + 1)) + min);
        prev = (num === prev && min !== max) ? rand() : num;
        return prev;
    };
};

function pmx(mom, dad, cut1, cut2) {
    mom = mom.slice(0);
    dad = dad.slice(0);
    var cut1 = cut1 ? cut1 : getIntegerRandom(1, mom.length / 2)();   // left side of crossover section
    var cut2 = cut2 ? cut2 : getIntegerRandom(cut1 + 1, mom.length - 2)();   // right side of crossover section
    console.log("cut:", cut1, "--", cut2 - cut1, "--", cut2);
    var child = Array(mom.length);
    var genomeDic = {};
    var childEmptyGenes = [];

    // copy:  [   |-----|   ]   from mom
    for (let i = cut1; i <= cut2; i++) {
        child[i] = mom[i];
        genomeDic[mom[i]] = true; // gene used
    }

    // copy:  [---|     |   ]   from dad
    for (let i = 0; i < cut1; i++) {
        if (!genomeDic[dad[i]]) {
            child[i] = dad[i];
            genomeDic[dad[i]] = true; // gene used
        }
        else {
            childEmptyGenes.push(i);
        }
    }

    // copy:  [   |     |---]   from dad
    for (let i = cut2 + 1; i < dad.length; i++) {
        if (!genomeDic[dad[i]]) {
            child[i] = dad[i];
            genomeDic[dad[i]] = true; // gene used
        }
        else {
            childEmptyGenes.push(i);
        }
    }

    // set child remain genes
    for (let i = 0; i < dad.length; i++) {
        if (!genomeDic[i]) {
            child[childEmptyGenes.pop()] = i;
        }
    }

    return child;
};
module.exports = pmx;

// var mom = [1, 0, 3, 4, 5, 6, 7, 1];
// //               ----------
// var dad = [2, 5, 4, 0, 6, 7, 3, 1];
// var res = [2, 0, 3, 4, 5, 6, 7, 1]; // expected result of PMX

// for (let i = 0; i < 100; i++) {
//     var result = pmx(mom, dad);
//     console.log(result);
// }

