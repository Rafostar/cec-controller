/*
   Toggles between 3 available HDMI ports.
   Port number can be set with 'hdmiPorts' option when creating new cec-controller object.
   Desired port number can also be passed to 'changeSource()' function
   (e.g. cec.dev0.changeSource(2) should switch to input 2).
*/

const cecInit = require('./shared/init');
const writeLine = require('./shared/writeLine');
cecInit().then(test);

function test()
{
	writeLine();
	console.log('--- TV HDMI Switch Test ---');
	changeSource();
}

async function changeSource()
{
	writeLine(`Switching HDMI input...`);
	await cec.dev0.changeSource();

	writeLine(`Switching to next port in 5 sec...`);
	setTimeout(changeSource, 5000);
}
