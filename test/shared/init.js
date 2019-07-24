const cecController = require('../../index');
const writeLine = require('./writeLine');
process.stdin.resume();

module.exports = () =>
{
	return new Promise((resolve, reject) =>
	{
		writeLine('CEC Controller initializing...');
		var cec = new cecController();

		cec.on('ready', async() =>
		{
			if(cec.dev0.powerStatus !== 'on')
			{
				writeLine('Turning ON TV...');
				await cec.dev0.turnOn();
			}

			writeLine('Setting this device as active source...');
			await cec.setActive();

			resolve();
		});

		cec.on('error', (err) => writeLine(err.message));
	});
}
