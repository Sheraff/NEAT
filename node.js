const ACTIVATIONS_NAMES = ['abs', 'clamped', 'cube', 'exp', 'gauss', 'hat', 'identity', 'inv', 'log', 'relu', 'elu', 'sigmoid', 'sin', 'square', 'tanh', 'binary']

const ACTIVATIONS = new Map([
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

const AGGREGATIONS_NAMES = ['product', 'sum', 'max', 'min', 'maxabs', 'median', 'mean']

const AGGREGATIONS = new Map([
	['product', arr => arr.reduce((accu, curr) => accu * curr, 1)],
	['sum', arr => arr.reduce((accu, curr) => accu + curr, 0)],
	['max', arr => Math.max(...arr)],
	['min', arr => Math.min(...arr)],
	['maxabs', arr => Math.max(...arr.map(Math.abs))],
	['median', arr => arr.sort()[Math.ceil(arr.length / 2)]],
	['mean', arr => arr.reduce((accu, curr) => accu + curr, 0) / arr.length],
])

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

let globalNodeId = 0
export default class NodeGene {
	static getID() {
		return globalNodeId++
	}

	static get length() {
		return globalNodeId
	}

	constructor({
		id = NodeGene.getID(),
		activation = 'identity',
		aggregation = 'sum',
		bias = 0,
		response = 1,
		type = 'hidden',
		name = '',
	} = {}) {
		this.model = { id, activation, aggregation, bias, response, type, name }
		this.id = id
		this.activation = ACTIVATIONS.get(activation)
		this.aggregation = AGGREGATIONS.get(aggregation)
		this.bias = bias
		this.response = response
		this.type = type
		this.name = name
		this.output = 0
	}

	respond(inputs) {
		return this.activation(this.bias + this.response * this.aggregation(inputs))
	}

	static mutate(model, chance = .01) {
		const newModel = {}
		Object.entries(model).forEach(([key, value]) => {
			if (Math.random() > chance)
				return newModel[key] = value

			switch (key) {
				case 'id':
				case 'type':
				case 'name':
					newModel[key] = value
					break
				case 'activation':
					newModel[key] = ACTIVATIONS_NAMES[getRandomInt(ACTIVATIONS_NAMES.length)]
					break
				case 'aggregation':
					newModel[key] = AGGREGATIONS_NAMES[getRandomInt(AGGREGATIONS_NAMES.length)]
					break
				case 'bias':
				case 'response':
					newModel[key] = Math.random()
			}
		})
		return newModel
	}

	static mate(a, b) {
		return Math.random() < .5 ? a : b
	}
}