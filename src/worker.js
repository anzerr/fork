
const cp = require('child_process'),
	events = require('events');

class Worker extends events {

	constructor(path, config = {}) {
		super();
		this.keys = {1: 'close', 2: 'found'};
		this.alive = true;
		this.fork = cp.fork(path, {env: {config: JSON.stringify(config)}});
		this.fork.on('message', (m) => {
			let data = Buffer.from(m.data), key = this.keys[data[0]];
			if (key) {
				let d = JSON.parse(data.slice(1, data.length));
				this.emit(key, d);
				return;
			}
			throw new Error('wrong message flag');
		});
		this.fork.on('error', (err) => {
			this.emit('error', err);
		});
		this.fork.on('exit', (code) => {
			this.alive = false;
			this.emit('exit', code);
		});
	}

	close() {
		if (this.alive) {
			try {
				this.fork.send(1);
			} catch(e) {
				// done
			}
		}
		setTimeout(() => {
			try {
				this.fork.kill(0);
				process.kill(this.fork.pid, 0);
			} catch(e) {
				// done
			}
		}, 100);
	}

	found() {
		let start = process.hrtime();
		return new Promise((resolve) => {
			this.once('found', (data) => {
				let end = process.hrtime(start);
				resolve([end[0] * 1e9 + end[1], data]);
			});
		});
	}

}

module.exports = Worker;
