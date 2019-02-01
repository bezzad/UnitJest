"use strict";

function GA() {
    this.ChromosomeLenght = 8;
    this.PopunationLenght = 100;
    this.SelectionPercent = 50;
    this.MutationProbability = 20;
    this.RegenerationLimit = Number.MAX_SAFE_INTEGER;
    this.RegenerationCounter = 0;
    this.MutationGeneCount = 1;
    this.Popunation;

    this.Chromosome = function (n) {
        this.len = n
        this.genome = new Array(n);
        this.fitness = Number.MAX_SAFE_INTEGER;

        this.evaluate = function () {
            let fit = 0;
            // calc each gene in this chromosome
            for (let g = 0; g < this.len; g++) {
                for (let i = g + 1; i < this.len; i++) {
                    if (this.genome[g] === this.genome[i]) // check no conflict in this row
                        fit++;

                    let dist = i - g;
                    if (this.genome[g] + dist === this.genome[i] ||
                        this.genome[g] - dist === this.genome[i]) // check no conflict in diameter
                        fit++;
                };
            };

            this.fitness = fit;
        }

        this.randomize = function () {
            let nums = Array.apply(null, { length: this.len }).map(Number.call, Number); // N:8 => [1,2,3,4,5,6,7,8]
            for (let g = 0; g < this.len; g++) {
                var rand = Math.random();
                rand *= (nums.length - 1);
                rand = Math.round(rand);
                this.genome[g] = nums[rand];
                nums.splice(rand, 1); // remove selected number
            }
            this.evaluate();

            return this;
        }
    }

    this.crossover = function (momChrom, dadChrom) {
        let rand = Math.random();
        let cuterGen = Math.ceil(rand * (this.ChromosomeLenght - 1));
        let child = new this.Chromosome(this.ChromosomeLenght);
        child.genome = momChrom.genome.slice(cuterGen);
        child.genome.push.apply(child.genome, dadChrom.genome.slice(0, cuterGen));
        // console.log("crossover", child.genome);
        return child;
    }

    this.mutation = function (chromosome, rate) {
        let rand = Math.random();
        if (rand * 100 <= rate) { // if random number occured within mutation rate
            for (let i = 0; i <= this.MutationGeneCount; i++) {
                rand = Math.random();
                let gen1 = Math.ceil(rand * (chromosome.len - 1));
                rand = Math.random();
                let gen2 = Math.ceil(rand * (chromosome.len - 1));

                // swape two gene from genome
                let genBuffer = chromosome.genome[gen1];
                chromosome.genome[gen1] = chromosome.genome[gen2];
                chromosome.genome[gen2] = genBuffer;
            }
        }
        // console.log("mutation", chromosome.genome);
    }

    this.Selection = function (percent) {
        let keepCount = percent * this.PopunationLenght / 100;
        this.Popunation.splice(keepCount); // remove week chromosomes from keepCount index to end of array  
        this.regeneration(); // start new generation   
    }

    // sort population based on fitness: [1,2,3,6,7,90,...]
    this.evaluation = function () {
        this.Popunation.sort((a, b) => a.fitness - b.fitness);
        if (this.Popunation[0].fitness === 0 || this.RegenerationCounter >= this.RegenerationLimit) { // if GA end condition occured then return false to stop generation;
            return false;
        }

        return true;
    }

    this.regeneration = function () {
        this.RegenerationCounter++;
        // console.log("regeneration", this.RegenerationCounter);
        let newPopulation = [];

        // create new chromosomes 
        for (let index = this.Popunation.length; index < this.PopunationLenght; index++) {

            let mom = this.getRandomeParent();
            // console.log("mom", mom);
            let dad = this.getRandomeParent();
            // console.log("dad", dad);
            let child = this.crossover(mom, dad);
            // console.log("child", child);
            this.mutation(child, this.MutationProbability);
            child.evaluate();
            newPopulation.push(child);
        }

        this.Popunation.push.apply(this.Popunation, newPopulation); // append newPopulation to end of this.Popunation
    }

    this.getRandomeParent = function () {
        let parentIndex = Math.random();
        parentIndex = Math.ceil(parentIndex * (this.Popunation.length - 1));
        if (this.Popunation[parentIndex] == null)
            throw Error();
        return this.Popunation[parentIndex];
    }

    this.Start = function (n, popLenght, selectionPercent, mutationRate, maxRegenerationCount) {
        console.log("Started...");
        this.ChromosomeLenght = n || this.ChromosomeLenght;
        this.PopunationLenght = popLenght || this.PopunationLenght;
        this.SelectionPercent = selectionPercent || this.SelectionPercent;
        this.MutationProbability = mutationRate || this.MutationProbability;
        this.RegenerationLimit = maxRegenerationCount || this.RegenerationLimit;
        this.MutationGeneCount = this.MutationProbability * this.ChromosomeLenght / 100;
        this.Popunation = Array.apply(null, { length: this.PopunationLenght }).map(c => new this.Chromosome(this.ChromosomeLenght).randomize());

        while (this.evaluation()) {
            this.Selection(this.SelectionPercent);
        }

        return this.Popunation[0]; // Elitest chromosome
    }
}


console.log("START GA");
var g = new Promise(function (resolve, reject) {
    setTimeout(function () {
        var ga = new GA();
        var result = ga.Start(8, 100, 50, 20, 1000);
        console.log("Generation", ga.RegenerationCounter)
        resolve(result);
    }, 1);
});

g.then(d => {
    console.log("end", d.fitness, d.genome);
})