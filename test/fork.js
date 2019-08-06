
const {Client} = require('../index.js'),
	crypto = require('crypto');

class Work extends Client {

	constructor() {
		super();
		this.data = ['', 0];
		this.on('close', () => {
			this.close([this.data[0].toString('hex'), this.data[1]]);
		});
		this.run(this.config.key, 0);
	}

	run(key, i) {
		if (this.done) {
			return;
		}
		const hash = crypto.createHash('sha256').update(key).digest('hex');
		this.data[0] = hash;
		this.data[1] = i;
		let h = parseInt(hash.slice(0, 16), 16);
		// console.log(hash, h, CONFIG.threshold);
		if (h >= this.config.threshold) {
			return this.result(this.data);
		}
		if (i % 1000 === 0) {
			setTimeout(() => this.run(hash, i + 1), 0);
		} else {
			this.run(hash, i + 1);
		}
	}

}

new Work();
