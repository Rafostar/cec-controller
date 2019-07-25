const cecController = require('../../index');
const writeLine = require('./writeLine');
process.stdin.resume();

module.exports = () =>
{
	return new Promise((resolve, reject) =>
	{
		writeLine('CEC Controller initializing...');
		var cec = new cecController();

		cec.on('ready', async(controller) =>
		{
			if(controller.dev0.powerStatus === 'standby')
			{
				writeLine('Turning ON TV...');
				await controller.dev0.turnOn();
			}

			writeLine('Setting this device as active source...');
			await controller.setActive();

			resolve({ controller, cec });
		});

		cec.on('error', (err) => writeLine(err.message));
	});
}
