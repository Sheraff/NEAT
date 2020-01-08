let globalConnectionId = 0

export default class ConnectionGene {
	static getID() {
		return globalConnectionId++
	}

	constructor({
		nodes: { from, to } = {},
		weight = 1,
		expressed = true,
		innovation = ConnectionGene.getID()
	} = {}) {
		this.model = { nodes: { from, to }, weight, expressed, innovation }
		this.nodes = { from, to }
		this.weight = weight
		this.expressed = expressed
		this.innovation = innovation
	}

	get id() {
		return this.innovation
	}

	transfer(value) {
		return this.expressed ? value * this.weight : 0
	}

	static mutate(model, chance = .01) {
		const newModel = {}

		Object.entries(model).forEach(([key, value]) => {
			if (Math.random() > chance)
				return newModel[key] = value

			switch (key) {
				case 'innovation':
				case 'nodes':
					newModel[key] = value
					break
				case 'expressed':
					newModel[key] = Math.random() < .5
					break
				case 'weight':
					newModel[key] = Math.random()
					break
			}
		})

		return newModel
	}

	static mate(a, b) {
		return Math.random() < .5 ? a : b
	}
}