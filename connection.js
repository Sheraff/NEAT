export default class ConnectionGene {
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
	} = {}) {
		this.nodes = { from, to }
		this.weight = weight
		this.expressed = expressed
		this.innovation = innovation
	}
}