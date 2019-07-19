# cec-controller
Easy to use wrapper that does not keep cec-client running in background

Requires `cec-client` binary.

### Usage Examples
```javascript
var CecController = require('cec-controller');
var cec = new CecController();

console.log(cec);
/*
{
  dev0: {
     name: 'TV',
     address: '0.0.0.0',
     activeSource: 'no',
     vendor: 'Samsung',
     osdString: 'TV',
     cecVersion: '1.4',
     powerStatus: 'on',
     language: 'eng',
     turnOn: [Function: bound command],    // Turn on dev0 (TV)
     turnOff: [Function: bound command]    // Turn off dev0 (TV)
  },
  setActive: [Function: bound command],    // Send source active signal (switches TV input)
  setInactive: [Function: bound command],  // Send source inactive signal
  volumeUp: [Function: bound command],     // Increase amplifier volume
  volumeDown: [Function: bound command],   // Decrease amplifier volume
  mute: [Function: bound command]          // Mute amplifier
}
*/
```

#### Asynchronous execution
Each function returns a *Promise*. They are executed asynchronously by default.

```javascript
cec.dev0.turnOn();
console.log('Sending turn on signal to TV');

setTimeout(() => cec.setActive(), 5000);
console.log('Changing TV input source in 5 sec...');
```

#### Synchronous execution
Synchronous execution can be achieved by using *await* inside *async* function.

```javascript
async function controlTv()
{
	await cec.dev0.turnOn();
	console.log('Turned on TV');

	await cec.setActive();
	console.log('Changed TV input source');
}

async function increaseVolume(count)
{
	while(count--) await cec.volumeUp();
}

controlTv();
increaseVolume(3); // Increase volume 3 times
```
