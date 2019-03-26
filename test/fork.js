'use strict';

let done = false;
let keepAlive = () => {
	return done ? process.exit(0) : setTimeout(keepAlive, 200);
};
keepAlive(); // keep the process from closing

const crypto = require('crypto');

const result = ['', 0];
const CONFIG = JSON.parse(process.env.config);
console.log(CONFIG);

process.on('message', () => {
	if (!done) {
		done = true;
		result[0] = result[0].toString('hex');
		process.send(Buffer.concat([
			Buffer.from([0x01]),
			Buffer.from(JSON.stringify(result))
		]));
	}
});

const run = (key, i) => {
	if (done) {
		return;
	}
	const hash = crypto.createHash('sha256').update(key).digest('hex');
	result[0] = hash;
	result[1] = i;
	let h = parseInt(hash.slice(0, 16), 16);
	// console.log(hash, h, CONFIG.threshold);
	if (h >= CONFIG.threshold) {
		// done = true;
		process.send(Buffer.concat([
			Buffer.from([0x02]),
			Buffer.from(JSON.stringify(result))
		]));
		// return;
	}
	if (i % 1000 === 0) {
		setTimeout(() => {
			run(hash, i + 1);
		}, 0);
	} else {
		run(hash, i + 1);
	}
};
run(CONFIG.key, 0);
