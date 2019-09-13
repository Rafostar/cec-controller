/*
   Turns on TV (if in standby) and switches active source to current device.
*/

const cecInit = require('./shared/init');
cecInit().then(test);

function test(obj)
{
	console.log('--- TV Active Source Changed ---\n');
	console.log('CURRENT STATUS');
	console.log(obj.controller);
}
