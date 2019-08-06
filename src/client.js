
const events = require('events');

class Client extends events {

	constructor() {
		super();
		this.done = false;
		this.config = JSON.parse(process.env.config);
		let keepAlive = () => {
			return this.done ? process.exit(0) : setTimeout(keepAlive, 200);
		};
		keepAlive();

		process.on('message', () => {
			if (!this.done) {
				this.done = true;
				this.emit('close');
			}
		});
	}

	send(type, payload) {
		process.send(Buffer.concat([
			Buffer.from([type]),
			Buffer.from(JSON.stringify(payload))
		]));
		return this;
	}

	close(payload) {
		this.done = true;
		return this.send(1, payload);
	}

	result(payload) {
		this.done = true;
		return this.send(2, payload);
	}

}

module.exports = Client;
