/*
   Turns ON and OFF TV.
*/

const cecInit = require('./shared/init');
const writeLine = require('./shared/writeLine');
cecInit().then(test);

function test()
{
	writeLine();
	console.log('--- TV Power Test ---');
	writeLine(`Turning OFF in 10 sec...`);
	setTimeout(powerOff, 10000);
}

async function powerOff()
{
	writeLine('Turning OFF TV...');
	await cec.dev0.turnOff();
	writeLine('TV should be in standby');
}
