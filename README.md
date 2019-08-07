
### `Intro`
Util to fork work to make pow other cpu intensive work easier

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/fork.library.git
npm install --save @anzerr/fork.lib
```

### `Example`
split work up
``` javascript
const {Fork} = require('fork.library'),
	path = require('path');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');

let f = new Fork(path.join(base, 'fork.js'), [
	{key: '1', threshold: 0xfffffc0000000000},
	{key: '2', threshold: 0xfffffc0000000000}
]);

f.on('error', (err) => {
	console.log('error', err);
}).on('found', (res) => {
	console.log('found', res);
	f.close();
}).on('shutdown', (res) => {
	console.log('shutdown', res, f.result());
});
```
worker (fork.js)
``` javascript
const {Client} = require('fork.library'),
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
```