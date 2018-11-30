
const Fork = require('./index.js'),
	path = require('path');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');

let f = new Fork(path.join(base, 'src/fork.js'), [
	{key: '1', threshold: 0xfffffc0000000000},
	{key: '2', threshold: 0xfffffc0000000000}
]);
console.log(f);

f.on('error', (err) => {
	console.log('error', err);
});

f.on('found', (res) => {
	console.log('found', res);
	f.close();
});

f.on('shutdown', (res) => {
	console.log('shutdown', res, f.result());
});
