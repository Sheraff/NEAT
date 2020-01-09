// implementing NEAT: http://nn.cs.utexas.edu/downloads/papers/stanley.cec02.pdf
// glossary / help: https://neat-python.readthedocs.io/en/latest/glossary.html#term-gene

import Individual, { makeZeroNodes } from './individual.js'

const initialNodesModel = makeZeroNodes()

const goal = .5
function distance(value) { return Math.abs(value - goal) }

let parent1 = new Individual({
	nodes: initialNodesModel
})
let parent2 = new Individual({
	nodes: initialNodesModel
})

let loop = 0;
do {

	const individuals = []
	for (let i = 0; i < 10; i++) {
		const combinedModel = Individual.mate(parent1, parent2, .01)
		individuals.push(new Individual(combinedModel))
	}

	for (let i = 0; i < 3; i++) {
		individuals.forEach(indiv => indiv.iterate([['anything', i/10]]))
	}

	// individuals.forEach(indiv => {
	// 	console.log(indiv.outputs.get('linear_speed').output)
	// })

	const [fit1, fit2] = individuals
		.filter(a => !Number.isNaN(a.outputs.get('linear_speed').output))
		.sort((a, b) => distance(b.outputs.get('linear_speed').output) - distance(a.outputs.get('linear_speed').output))

	parent1 = fit1
	parent2 = fit2

	console.log('-----------------------------------------------------')

} while (++loop < 10)




// console.log(indiv)

/**
 * 
 * 
class Gene
	this.model
	static mutate
	static mate
class Node extends Gene
class Connection extends Gene
class Attribute extends Gene

class Individual
	this.brain = new Brain(this.genome.nodes, this.genome.connections)
	this.body = new Body(this.genome.attributes)
	fitness()

class Brain
	this.neurons = new Map(nodes.map)
	this.axons = new Map(connections.map)
	iterate()

class Body
	this.constants = new Phenotype(attributes) // { max_speed, growth_rate, skin_color, ... }
	this.dynamics = { speed, direction, size }
	iterate()
 * 
 * 
 */