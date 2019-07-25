/*
   Turns ON and OFF TV.
*/

const cecInit = require('./shared/init');
const writeLine = require('./shared/writeLine');
cecInit().then(test);

function test(obj)
{
	var ctl = obj.controller;

	writeLine('');
	console.log('--- TV Power Test ---');
	writeLine('Turning OFF in 30 sec...');
	setTimeout(() => powerOff(ctl), 30000);
}

async function powerOff(ctl)
{
	writeLine('Turning OFF TV...');
	await ctl.dev0.turnOff();
	writeLine('TV should be in standby');
}
