"use strict";
var ut = require('./utilities');

class Chromosome {
    constructor(n) {
        this.len = n
        this.genome = new Array(n);
        this.fitness = Number.MAX_SAFE_INTEGER;
    }
    evaluate() {
        let fit = 0;
        // calc each gene in this chromosome
        for (let g = 0; g < this.len; g++) {
            for (let i = g + 1; i < this.len; i++) {
                // if (this.genome[g] === this.genome[i]) // check no conflict in this row
                //     fit++;

                let dist = i - g;
                if (this.genome[g] + dist === this.genome[i] ||
                    this.genome[g] - dist === this.genome[i]) // check no conflict in diameter
                    fit++;
            };
        };

        this.fitness = fit;
    }

    randomize() {
        let nums = Array.apply(null, { length: this.len }).map(Number.call, Number); // N:8 => [1,2,3,4,5,6,7,8]
        for (let g = 0; g < this.len; g++) {
            let rand = new ut.Rand(0, nums.length - 1).next();
            this.genome[g] = nums[rand];
            nums.splice(rand, 1); // remove selected number
        }
        this.evaluate();

        return this;
    }
}

class GA {
    constructor(n, popLenght, selectionPercent, mutationRate, maxRegenerationCount, convergenceRate) {
        this.ChromosomeLenght = n || 8;
        this.PopunationLenght = popLenght || 100;
        this.SelectionPercent = selectionPercent || 50;
        this.MutationProbability = mutationRate || 20;
        this.RegenerationLimit = maxRegenerationCount || Number.MAX_SAFE_INTEGER;
        this.RegenerationCounter = 0;
        this.ConvergenceRate = convergenceRate || 60;
        // this.MutationGeneCount = Math.round(this.MutationProbability * (0.1 * this.ChromosomeLenght) / 100);
        this.Popunation = Array.apply(null, { length: this.PopunationLenght }).map(c => new Chromosome(this.ChromosomeLenght).randomize());
    }

    crossover(mom, dad) {
        if (mom == dad)
            console.log("Oh shet!!! mom and dad are the same!?");
        var child = new Chromosome(this.ChromosomeLenght);
        child.genome = this.pmx(mom.genome, dad.genome);

        return child;
    }

    // PMX - Partially Mapped Crossover
    pmx(mom, dad, cut1, cut2) {
        mom = mom.slice(0);
        dad = dad.slice(0);
        var cut1 = cut1 ? cut1 : new ut.Rand(1, mom.length / 2).next();   // left side of crossover section
        var cut2 = cut2 ? cut2 : new ut.Rand(cut1 + 1, mom.length - 2).next();   // right side of crossover section
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

    mutation(chromosome, rate) {
        //  _______________
        // |1|2|6|4|5|3|7|8|
        //      ^     ^
        //        SWAP
        //
        if (new ut.Rand(0, 100).next() <= rate) { // if random number occured within mutation rate
            let rand = new ut.Rand(0, chromosome.len - 1);
            let gen1 = rand.next();
            let gen2 = rand.next();
            if(gen1 == gen2)
                throw new Error("Mutation gens are duplicate!");
            // swape two gene from genome
            let genBuffer = chromosome.genome[gen1];
            chromosome.genome[gen1] = chromosome.genome[gen2];
            chromosome.genome[gen2] = genBuffer;
        }
    }

    Selection(percent) {
        let keepCount = percent * this.PopunationLenght / 100;
        this.Popunation.splice(keepCount); // remove week chromosomes from keepCount index to end of array  
        this.regeneration(); // start new generation   
    }

    // sort population based on fitness: [1,2,3,6,7,90,...]
    evaluation() {
        this.Popunation.sort((a, b) => a.fitness - b.fitness);
        let elit = this.Popunation[0];
        // if GA end condition occured then return false to stop generation;
        if (elit.fitness === 0) {
            console.log("GA ended due to the best chromosome found :)");
            return false; // stop GA
        }
        if (this.RegenerationCounter >= this.RegenerationLimit) {
            console.log("GA ended due to the limitation of regeneration!!!");
            return false; // stop GA
        }
        if (this.Popunation.filter(c => c.fitness == elit.fitness).length >=
            Math.min(this.ConvergenceRate / 100, 0.9) * this.PopunationLenght) {
            // calculate histogram to seen chromosomes convergence            
            console.log("GA ended due to the convergence of chromosomes :(");
            return false;
        }

        return true; // continue GA
    }

    regeneration() {
        this.RegenerationCounter++;
        if (this.RegenerationCounter % 100 === 0)
            console.log("generation", this.RegenerationCounter, "elite fitness", this.Popunation[0].fitness);
        let newPopulation = [];

        // create new chromosomes 
        for (let index = this.Popunation.length; index < this.PopunationLenght; index++) {
            let rand = new ut.Rand(0, this.Popunation.length - 1);
            let mom = this.getRandomeParent(rand);
            let dad = this.getRandomeParent(rand);
            let child = this.crossover(mom, dad);
            this.mutation(child, this.MutationProbability);
            child.evaluate();
            newPopulation.push(child);
        }

        this.Popunation.push.apply(this.Popunation, newPopulation); // append newPopulation to end of this.Popunation
    }

    getRandomeParent(rand) {
        let parentIndex = rand.next();
        let parent = this.Popunation[parentIndex];
        if (parent == null) {
            throw new Error("GA.getRandomeParent has ERROR");
        }
        return parent;
    }

    Start() {
        console.log("Starting GA ...");

        while (this.evaluation()) {
            this.Selection(this.SelectionPercent);
        }

        return this.Popunation[0]; // Elitest chromosome
    }
}
//                    N , Pop, SR, MR, ReGen, CR
// best practice: GA(200, 500, 30, 50, 10000, 75); 4775ms
// fast practice: GA(200, 500, 10, 50, 10000, 75); 2659ms
// N-Queen O(n^n) | O(n!) == NP-Complex
ut.StopWatch.start();
// ------------------------------------------------------
//              N , Pop, SR, MR, ReGen, CR
var ga = new GA(100, 500, 30, 50, 10000, 75);
var result = ga.Start();
console.log("Result:", result);
console.log("Generation:", ga.RegenerationCounter)
// ------------------------------------------------------
ut.StopWatch.stop();