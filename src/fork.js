
const Worker = require('./worker.js'),
	events = require('events');

class Fork extends events {

	constructor(path, option = []) {
		super();
		this.thread = option.length || 0;
		this.option = option;
		this.path = path;
		this.h = [];
		this.out = {};
		this._result = [];

		let wait = [];
		for (let i = 0; i < this.thread; i++) {
			((id) => {
				wait.push(new Promise((resolve) => {
					let w = new Worker(this.path, option[id] || {});
					w.on('found', (res) => {
						this._result.push(res);
						this.out[id] = res;
						this.emit('found', res);
					}).on('close', (res) => {
						this.out[id] = res;
					}).on('error', (err) => {
						this.emit('error', [id, err]);
					}).on('exit', () => {
						resolve();
					});
					this.h.push(w);
				}));
			})(i);
		}
		Promise.all(wait).then(() => {
			this.emit('shutdown', this.out);
		});
	}

	result() {
		return this._result;
	}

	close() {
		let wait = [];
		for (let x in this.h) {
			((h) => {
				wait.push(new Promise((resolve) => {
					h.on('exit', () => {
						resolve();
					});
				}));
				h.close();
			})(this.h[x]);
		}
		return Promise.all(wait).then(() => this.out);
	}

}

module.exports = Fork;
