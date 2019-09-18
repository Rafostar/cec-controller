# cec-controller
[![License](https://img.shields.io/github/license/Rafostar/cec-controller.svg)](https://github.com/Rafostar/cec-controller/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/cec-controller.svg)](https://www.npmjs.com/package/cec-controller)
[![Downloads](https://img.shields.io/npm/dt/cec-controller.svg)](https://www.npmjs.com/package/cec-controller)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
[![Donate](https://img.shields.io/badge/Donate-PayPal.Me-lightgrey.svg)](https://www.paypal.me/Rafostar)

Requires CEC capable device (e.g. Raspberry Pi or USB-CEC adapter).<br>
Additionally `cec-client` must be installed. On Raspbian it is included in cec-utils package.

Controller scans devices on startup. It takes a while (scan is done async and result is returned in "ready" event).

### Usage Examples
```javascript
var CecController = require('cec-controller');
var cecCtl = new CecController();

cecCtl.on('ready', (controller) => console.log(controller));
cecCtl.on('error', console.error);

/*
{
  dev0: {
     name: 'TV',
     logicalAddress: '0',
     address: '0.0.0.0',
     activeSource: 'no',
     vendor: 'Samsung',
     osdString: 'TV',
     cecVersion: '1.4',
     powerStatus: 'on',
     language: 'eng',
     turnOn: [Function: bound changePower],       // Turn on dev0 (TV)
     turnOff: [Function: bound changePower],      // Turn off dev0 (TV)
     togglePower: [Function: bound togglePower],  // Transition to power "on" from "standby" and vice versa
     changeSource: [Function],                    // Switch HDMI input (optional arg is port number)
     sendKey: [Function]                          // Send key press to this device
  },
  dev4: {
     name: 'Playback 1',
     logicalAddress: '4',
     address: '3.0.0.0',
     activeSource: 'no',
     vendor: 'Pulse Eight',
     osdString: 'CEC-Control',
     cecVersion: '1.4',
     powerStatus: 'on',
     language: 'eng',
     turnOn: [Function: bound changePower],
     turnOff: [Function: bound changePower],
     togglePower: [Function: bound togglePower]
  },
  setActive: [Function: bound changeActive],      // Send source active signal (switches TV input)
  setInactive: [Function: bound changeActive],    // Send source inactive signal
  volumeUp: [Function: bound command],            // Increase amplifier volume
  volumeDown: [Function: bound command],          // Decrease amplifier volume
  mute: [Function: bound command],                // Mute amplifier
  getKeyNames: [Function: bound getNamesArray],   // Returns array of supported keys (for use with sendKey())
  command: [Function: command]                    // Send custom signal (arg is send as input to cec-client)
}
*/
```

#### Send TV remote key presses
Send key press to your TV, player or receiver. Get the list of available key names with `cecCtl.getKeyNames()`.
```javascript
var CecController = require('cec-controller');
var cecCtl = new CecController();

cecCtl.on('ready', readyHandler);
cecCtl.on('error', console.error);

function readyHandler(controller)
{
	/* In this example dev1 is a satellite decoder */
	controller.dev1.sendKey('up').then((success) =>
	{
		if(success)
			console.log('Successfully send "up" key to decoder');
		else
			console.error('Could not send input key!');
	});
}
```

#### Receive TV remote input
Use `keypress`, `keydown` or `keyup` events to implement code logic that depends on the pressed TV remote button.
```javascript
var CecController = require('cec-controller');
var cecCtl = new CecController();

cecCtl.on('ready', readyHandler);
cecCtl.on('error', console.error);

function readyHandler(controller)
{
	console.log('Turning ON TV...');

	controller.dev0.turnOn().then(() =>
	{
		controller.setActive();
		console.log('Press any button on TV remote');
	});

	cecCtl.on('keypress', (keyName) => console.log(`User pressed: ${keyName}`));
}
```

#### Asynchronous execution
Each function returns a *Promise*. They are executed asynchronously by default.

```javascript
controller.dev0.turnOn();
console.log('Sending turn on signal to TV');

setTimeout(() => controller.setActive(), 5000);
console.log('Changing TV input source in 5 sec...');
```

#### Synchronous execution
Synchronous execution can be achieved by using *await* inside *async* function.

```javascript
async function controlTv()
{
	await controller.dev0.turnOn();
	console.log('Turned on TV');

	await controller.setActive();
	console.log('Changed TV input source');
}

async function increaseVolume(count)
{
	while(count--) await controller.volumeUp();
}

controlTv();
increaseVolume(3); // Increase volume 3 times
```

Additional pre-made runnable scripts can be found inside "test" folder.

## Donation
If you like my work please support it by buying me a cup of coffee :-)

[![PayPal](https://github.com/Rafostar/gnome-shell-extension-cast-to-tv/wiki/images/paypal.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
