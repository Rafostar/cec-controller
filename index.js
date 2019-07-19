const { exec, execSync } = require('child_process');

module.exports = class Client
{
	constructor()
	{
		var devices = this.scanDevices();
		if(Object.keys(devices).length === 0) return {};

		for(var device in devices)
			devices[device] = { ...devices[device], ...this.getDeviceFunctions(devices[device]) };

		devices = { ...devices, ...this.getGlobalFunctions() };

		return devices;
	}

	scanDevices()
	{
		var outStr;
		var outArray = [];

		try {
			outStr = execSync(`echo 'scan' | cec-client -s -d 1`,
				{ stdio: 'pipe', windowsHide: true }).toString();

			outArray = outStr.split('device #');
		}
		catch(err) {}

		var devicesObject = {};

		outArray.forEach(device =>
		{
			var devName = device.substring(device.indexOf(':') + 2, device.indexOf('\n'));
			var devId = device.substring(0, device.indexOf(':'));

			if(!devName || !devId) return;

			devicesObject['dev' + devId] = { name: devName, logicalAddress: devId };

			var data = device.split('\n');

			for(var i = 1; i < data.length; i++)
			{
				var params = data[i].split(':');
				if(params.length !== 2) break;

				var key = params[0].toLowerCase();
				key = key.split(' ');

				if(key.length > 1)
				{
					for(var j = 1; j < key.length; j++)
					{
						key[j] = key[j].charAt(0).toUpperCase() + key[j].slice(1);
					}
				}

				key = key.toString().replace(/,/g, '');

				var value = params[1].trimLeft();
				devicesObject['dev' + devId][key] = value;
			}
		});

		return devicesObject;
	}

	command(action, logicalAddress)
	{
		return new Promise((resolve, reject) =>
		{
			if(logicalAddress) exec(`echo '${action} ${logicalAddress}' | cec-client -s -d 1`, () => resolve());
			else exec(`echo '${action}' | cec-client -s -d 1`, () => resolve());
		});
	}

	getStatus(device)
	{
		return new Promise((resolve, reject) =>
		{
			exec(`echo 'pow ${device.logicalAddress}' | cec-client -s -d 1`, (error, stdout, stderr) =>
			{
				if(error) return resolve(null);

				var linesArray = stdout.split('\n');
				var result = linesArray.filter(line => line.includes('power status:'));
				var status = result[0].split(':')[1].trim();

				device.powerStatus = status;
				resolve(status);
			});
		});
	}

	getDeviceFunctions(device)
	{
		return {
			turnOn: this.command.bind(this, 'on', device.logicalAddress),
			turnOff: this.command.bind(this, 'standby', device.logicalAddress),
			getStatus: this.getStatus.bind(this, device)
		}
	}

	getGlobalFunctions()
	{
		return {
			setActive: this.command.bind(this, 'as', null),
			setInactive: this.command.bind(this, 'is', null),
			volumeUp: this.command.bind(this, 'volup', null),
			volumeDown: this.command.bind(this, 'voldown', null),
			mute: this.command.bind(this, 'mute', null)
		}
	}
}
