/*
   Prints pressed button name to stdout.
   For use to determine which buttons can be used with CEC on a particular TV set.
*/

const cecInit = require('./shared/init');
const writeLine = require('./shared/writeLine');
cecInit().then(test);

function test(obj)
{
	var cec = obj.cec;

	console.log('--- TV Remote Test ---');
	writeLine('Press any button on TV remote');

	cec.on('keypress', (keyName) => writeLine(`User pressed: ${keyName}`));
}
