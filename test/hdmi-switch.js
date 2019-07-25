/*
   Toggles between 3 available HDMI ports.
   Port number can be set with 'hdmiPorts' option when creating new cec-controller object.
   Desired port number can also be passed to 'changeSource()' function
   (e.g. ctl.dev0.changeSource(2) should switch to input 2).
*/

const cecInit = require('./shared/init');
const writeLine = require('./shared/writeLine');
cecInit().then(test);

function test(obj)
{
	var ctl = obj.controller;

	writeLine('');
	console.log('--- TV HDMI Switch Test ---');

	writeLine(`Switching port every 5 sec...`);
	changeSource(ctl);
}

async function changeSource(ctl)
{
	await ctl.dev0.changeSource();
	setTimeout(() => changeSource(ctl), 5000);
}
