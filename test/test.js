
const Fork = require('../index.js'),
	path = require('path');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');

let f = new Fork(path.join(base, 'fork.js'), [
	{key: '1', threshold: 0xfffffc0000000000},
	{key: '2', threshold: 0xfffffc0000000000}
]);
console.log(f);

setTimeout(() => {
	f.close();
}, (60 * 1000) * 1);

f.on('error', (err) => {
	console.log('error', err);
});

f.on('found', (res) => {
	console.log('found', res);
});

f.on('shutdown', (res) => {
	console.log('shutdown', res, f.result());
});
