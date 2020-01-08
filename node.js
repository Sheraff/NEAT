ACTIVATIONS = new Map([
	['abs', x => Math.abs(x)],
	['clamped', x => Math.min(1, Math.max(-1, x))],
	['cube', x => Math.pow(x, 3)],
	['exp', x => Math.exp(x)],
	['gauss', x => x],
	['hat', x => Math.max(0, x < 0 ? 1 + x : 1 - x)],
	['identity', x => x],
	['inv', x => 1 / x],
	['log', x => Math.log(x)],
	['relu', x => x < 0 ? 0 : x],
	['elu', x => x < 0 ? Math.exp(x) - 1 : x],
	// ['lelu', x => x],
	// ['selu', x => x],
	['sigmoid', x => Math.tanh(x) / 2 + 1],
	['sin', x => Math.sin(x)],
	// ['softplus', x => x],
	['square', x => Math.pow(x)],
	['tanh', x => Math.tanh(x)],
	['binary', x => x < 0 ? 0 : 1],
])

AGGREGATIONS = new Map([
	['product', arr => arr.reduce((accu, curr) => accu * curr, 1)]
	['sum', arr => arr.reduce((accu, curr) => accu + curr, 0)]
	['max', arr => Math.max(...arr)]
	['min', arr => Math.min(...arr)]
	['maxabs', arr => Math.max(...arr.map(Math.abs))]
	['median', arr => arr.sort()[Math.ceil(arr.length / 2)]]
	['mean', arr => arr.reduce((accu, curr) => accu + curr, 0) / arr.length]
])

export default class NodeGene {
	static id = 0

	static getID () {
		return NodeGene.id++
	}

	static get length() {
		return NodeGene.id
	}

	constructor({
		id = NodeGene.getID(),
		activation = 'identity',
		aggregation = 'sum',
		bias = 0,
		response = 1,
	} = {}) {
		this.id = id
		this.activation = ACTIVATIONS.get(activation)
		this.aggregation = AGGREGATIONS.get(aggregation)
		this.bias = bias
		this.response = response
	}

	respond(inputs) {
		return this.activation(this.bias + this.response * this.aggregation(inputs))
	}
}