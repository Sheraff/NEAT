import { getRandomInt } from './utils.js'
import NodeGene from './node.js'
import ConnectionGene from './connection.js'

const INPUTS = [
	'anything',
]

const OUTPUTS = [
	'linear_speed',
	'angular_speed'
]

class BrainState {
	constructor(nodes) {
		this.state = new Map(nodes.map(node => ([node, []])))
	}

	reset() {
		for (const node of this.state.keys()) {
			this.state.set(node, [])
		}
	}

	pushInput(node, value) {
		this.state.get(node).push(value)
	}

	get get() {
		return this.state.get.bind(this.state)
	}
}

export function makeZeroNodes() {
	const models = []
	INPUTS.forEach((name, i) => {
		const node = new NodeGene({ type: 'input', name, id: i })
		models.push(node.model)
	})
	OUTPUTS.forEach((name, i) => {
		const node = new NodeGene({ type: 'output', name, id: INPUTS.length + i })
		models.push(node.model)
	})
	NodeGene.reservedLength = INPUTS.length + OUTPUTS.length
	return models
}

export default class Individual {
	constructor({
		connections = [],
		nodes = []
	} = {}) {
		this.model = { connections, nodes }
		this.connections = []
		this.nodes = []

		this.inputs = new Map()
		this.outputs = new Map()

		connections.forEach(model => {
			const connection = new ConnectionGene(model)
			this.connections[connection.id] = connection
		})
		nodes.forEach(model => {
			const node = new NodeGene(model)
			this.nodes[node.id] = node
			if (node.type === 'input')
				this.inputs.set(node.name, node)
			else if (node.type === 'output')
				this.outputs.set(node.name, node)
		})

		this.fitness = 0
		this.state = new BrainState(this.nodes.filter(node => !!node))
	}

	iterate(inputValues = []) {
		this.state.reset()

		// input sensory data into input nodes
		inputValues.forEach(([name, value]) => this.state.pushInput(this.inputs.get(name), value))

		// create array of inputs for each node, based on connections
		this.connections.forEach(connection => {
			if (!connection)
				return
			try {
				const value = this.nodes[connection.nodes.from].output
				this.state.pushInput(this.nodes[connection.nodes.to], connection.transfer(value))
			} catch (e) {
				console.log(this, connection)
				throw e
			}
		})

		// update output of each node, based on array of inputs
		this.nodes.forEach(node => {
			if (!node)
				return
			node.output = node.respond(this.state.get(node))
		})
	}

	static mate(a, b, chance = .01) {
		const model = {
			connections: Individual.mateGeneType(ConnectionGene, 'connections', a, b, chance),
			nodes: Individual.mateGeneType(NodeGene, 'nodes', a, b, chance),
		}
		if (Math.random() < .5) {
			if (Math.random() < .5)
				Individual.addConnection(model)
		} else {
			if (Math.random() < .5)
				Individual.addNode(model)
		}
		return model
	}

	static mateGeneType(prototype, key, a, b, chance) {
		const result = []
		const longestGenome = a.model[key].length > b.model[key].length ? a : b
		const shortestGenome = longestGenome === a ? b : a
		for (let i = 0; i < longestGenome.model[key].length; i++) {
			const geneA = longestGenome.model[key][i];
			const geneB = shortestGenome.model[key][i];
			if (!geneA && !geneB)
				continue
			if (geneA && geneB) {
				result.push(prototype.mutate(prototype.mate(geneA, geneB), chance))
				continue
			}
			result.push(prototype.mutate(geneA || geneB, chance))
		}
		return result
	}

	static addConnection(model) {
		const from = model.nodes[getRandomInt(model.nodes.length)].id
		const to = model.nodes[getRandomInt(model.nodes.length)].id
		const newConnection = new ConnectionGene({ nodes: { from, to } })
		model.connections.push(newConnection.model)
	}

	static addNode(model) {
		if (!model.connections.length)
			return
		const [connection] = model.connections.splice(getRandomInt(model.connections.length), 1)
		const node = new NodeGene()
		model.nodes.push(node.model)
		const connectionFrom = new ConnectionGene({ nodes: { from: connection.nodes.from, to: node.model.id } })
		model.connections.push(connectionFrom.model)
		const connectionTo = new ConnectionGene({ nodes: { from: node.model.id, to: connection.nodes.to } })
		model.connections.push(connectionTo.model)
		console.log(connection, node, connectionFrom, connectionTo, model.connections)
	}
}