// implementing NEAT: http://nn.cs.utexas.edu/downloads/papers/stanley.cec02.pdf
// glossary / help: https://neat-python.readthedocs.io/en/latest/glossary.html#term-gene

class Connection {
	static getID = (() => {
		let id = 0
		return () => id++
	})()

	constructor({
		nodes: {
			from = 0,
			to = 0
		} = {},
		weight = 0,
		expressed = false,
		innovation = Connection.getID()
	}) {
		this.nodes = { from, to }
		this.weight = weight
		this.expressed = expressed
		this.innovation = innovation
	}
}

class Individual {
	connections = []
	fitness = 0
}

class Population {
	static speciesThreshold = .2 // if distance(a, b) > speciesThreshold => a & b belong to ≠ species
	static bestRatio = .1 // within a species, take bestRatio% of fittest individuals to create next gen

	individuals = []

	static distance({connections: a}, {connections: b}) {
		let d = 0
		let weightDiffSum = 0
		let sharedCount = 0
		let countA = 0
		let countB = 0
		const smaller = a.length < b.length ? a : b
		for (let i = 0; i < smaller.length; i++) {
			if(a[i] && b[i]) {
				weightDiffSum += Math.abs(a.weight - b.weight)
				sharedCount++
			} else if(a[i] || b[i]) {
				d++
			}

			if(a[i]) countA++
			if(b[i]) countB++
		}
		const e = Math.abs(a.length - b.length)
		const w = weightDiffSum / sharedCount
		const n = Math.max(countA, countB)
		const c1 = 1 // weight of excess connections in distance
		const c2 = 1 // weight of disjoint connections in distance
		const c3 = 1 // weight of difference in connections' weights in distance

		return c1*e/n + c2*d/n + c3*w 
	}

	static offspringCount(species, avgPopulationFitness) {
		const speciesAdjustedFitnessSum = adjustedFitness(species.map(individual => individual.fitness))
			.reduce((accu, curr) => accu + curr)
		return speciesAdjustedFitnessSum / avgPopulationFitness
	}

	static adjustedFitness(fitnessArray) {
		return fitnessArray.map(fitness => fitness / fitnessArray.length)
	}
}