
const {Fork} = require('../index.js'),
	path = require('path');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');

let f = new Fork(path.join(base, 'fork.js'), [
	{key: '1', threshold: 0xfffffc0000000000},
	{key: '2', threshold: 0xfffffc0000000000}
]);

setTimeout(() => f.close(), (10 * 1000) * 1);

f.on('error', (err) => {
	console.log('error', err);
}).on('found', (res) => {
	console.log('found', res);
}).on('shutdown', (res) => {
	console.log('shutdown', res, f.result());
});
