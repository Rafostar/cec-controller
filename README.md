# cec-controller
Easy to use wrapper that does not keep cec-client running in background

Requires `cec-client` binary.

### Usage Example
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
     turnOn: [Function: bound command],
     turnOff: [Function: bound command]
  },
  setActive: [Function: bound command],
  setInactive: [Function: bound command],
  volumeUp: [Function: bound command],
  volumeDown: [Function: bound command],
  mute: [Function: bound command]
}
*/
cec.dev0.turnOn(); // Turn on device 0
cec.setActive();   // Send source active signal from current device (switches TV input)
cec.volumeUp();    // Increase TV or amplifier volume
```
