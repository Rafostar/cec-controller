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

			devicesObject['dev' + devId] = { name: devName };

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

	command(action, address)
	{
		if(address) exec(`echo '${action} ${address}' | cec-client -s -d 1`);
		else exec(`echo '${action}' | cec-client -s -d 1`);
	}

	getDeviceFunctions(device)
	{
		return {
			turnOn: this.command.bind(this, 'on', device.address),
			turnOff: this.command.bind(this, 'standby', device.address)
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
