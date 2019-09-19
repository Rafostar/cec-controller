const { exec, spawn } = require('child_process');
const { EventEmitter } = require('events');
const debug = require('debug');
const keymap = require('./keymap');

const ctl_debug = debug('cec-controller');
const client_debug = debug('cec-client');

module.exports = class Client
{
	constructor(opts)
	{
		if(typeof opts !== 'object') opts = {};

		this.osdString = (typeof opts.osdString === 'string'
			&& opts.osdString.length < 13) ? opts.osdString : 'CEC-Control';
		this.type = (typeof opts.type === 'string') ? opts.type.charAt(0) : 'p';
		this.hdmiPorts = (opts.hdmiPorts > 0) ? opts.hdmiPorts : 3;
		this.broadcast = (opts.broadcast === false) ? false : true;

		this.controlledDevice = 'dev0';
		this.sourceNumber = 0;
		this.keyReleaseTimeout = null;
		this.togglingPower = false;
		this.runningCheckStatus = false;
		this.enabled = true;

		this.cec = new EventEmitter();
		this.cec.closeClient = () => this._closeClient();
		this.myDevice = null;
		this.devices = {};

		this._scanDevices();

		return this.cec;
	}

	_closeClient()
	{
		return new Promise((resolve, reject) =>
		{
			this.enabled = false;
			if(this.client) this.client.kill();

			this.cec.removeAllListeners();
			this.cec = null;

			resolve(true);
		});
	}

	_scanDevices()
	{
		ctl_debug('Performing initial devices scan...');

		exec(`echo scan | cec-client -s -t ${this.type} -o ${this.osdString} -d 1`,
			{ maxBuffer: 5 * 1024 * 1024, windowsHide: true }, (error, stdout, stderr) =>
		{
			if(error)
			{
				ctl_debug(error);
				return this.cec.emit('error', new Error('App cec-client had an error!'));
			}

			ctl_debug('Devices scan finished successfully');
			this.devices = this._parseScanOutput(String(stdout));

			const scannedKeys = Object.keys(this.devices);
			if(scannedKeys.length === 0)
			{
				const scanErr = new Error('CEC scan did not find any devices!');
				ctl_debug(scanErr);
				return this.cec.emit('error', scanErr);
			}

			this.myDevice = this._getMyDevice(this.devices);
			if(!this.myDevice)
			{
				const myDeviceErr = new Error(`Could not obtain this CEC adapter info!`);
				ctl_debug(myDeviceErr);
				return this.cec.emit('error', myDeviceErr);
			}

			for(var deviceId in this.devices)
				this.devices[deviceId] = { ...this.devices[deviceId], ...this._getDeviceFunctions(deviceId) };

			this.devices = { ...this.devices, ...this._getGlobalFunctions() };
			ctl_debug('Finished controller object assembly');
			ctl_debug(this.devices);

			this._createClient();
		});
	}

	_parseScanOutput(outStr)
	{
		var devicesObject = {};
		var outArray = outStr.split('device #');

		if(outArray.length > 1)
		{
			outArray.shift();

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
		}

		return devicesObject;
	}

	_getMyDevice(devices)
	{
		var keys = Object.keys(devices);

		for(var key of keys)
		{
			var currObj = devices[key];

			if(typeof currObj !== 'object')
				continue;

			if(currObj.hasOwnProperty('osdString') && currObj.osdString === this.osdString)
			{
				ctl_debug(`Detected this device as: ${key}`);
				return key;
			}
		}

		ctl_debug('Could not detect this device!');
		return null;
	}

	_createClient()
	{
		this.doneInit = false;
		this.client = spawn('cec-client',
			['-t', this.type, '-o', this.osdString, '-d', 8],
			{ stdio: ['pipe', 'pipe', 'ignore'] });

		this.client.stdin.setEncoding('utf8');
		this.client.stdout.once('data', () => ctl_debug('cec-client background process started'));
		this.client.stdout.on('data', (data) => this._parseClientOutput(String(data)));
		this.client.once('close', (code) =>
		{
			this.client = null;
			ctl_debug(`cec-client exited with code: ${code}`);

			if(this.doneInit && this.enabled) this._createClient();
			else if(this.enabled) this.cec.emit('error', new Error(`App cec-client exited with code: ${code}`));
		});
	}

	_parseClientOutput(data)
	{
		var lines = data.split('\n');
		lines.forEach(line =>
		{
			if(line.length < 5) return;

			if(!line.startsWith(`power status:`))
				client_debug(line);

			if(!this.doneInit)
			{
				if(this.myDevice && line.includes('waiting for input'))
				{
					this.doneInit = true;
					ctl_debug('cec-client init successful');
					this.cec.emit('ready', this.devices);
				}

				return;
			}

			if(line.startsWith(`power status:`))
			{
				var logicalAddress = this.devices[this.controlledDevice].logicalAddress;
				var value = this._getLineValue(line);

				if(this.devices[this.controlledDevice].powerStatus !== value)
				{
					this.devices[this.controlledDevice].powerStatus = value;
					ctl_debug(`Updated dev${logicalAddress} powerStatus using stdout to: ${value}`);
				}

				this.cec.emit(`${logicalAddress}:powerStatus`, value);
			}
			else if(this.devices.hasOwnProperty('dev0') && line.startsWith('TRAFFIC:'))
			{
				if(line.includes('>>'))
				{
					var destAddress = this.devices[this.myDevice].logicalAddress;
					var value = this._getLineValue(line).toUpperCase();

					if(line.includes(`>> 0${destAddress}:44:`))
					{
						var keyName = keymap.getName(value);

						this.cec.emit('keypress', keyName);

						if(!this.keyReleaseTimeout)
							this.cec.emit('keydown', keyName);
					}
					else if(line.includes(`>> 0${destAddress}:8b:`))
					{
						if(this.keyReleaseTimeout)
							clearTimeout(this.keyReleaseTimeout);

						this.keyReleaseTimeout = setTimeout(() =>
						{
							this.cec.emit('keyup', keymap.getName(value));
							this.keyReleaseTimeout = null;
						}, 600);
					}
					else if(line.includes('>> 0f:36'))
					{
						ctl_debug('Received standby request on broadcast');
						ctl_debug('Checking devices powerStatus....');

						this._checkDevicesStatus(null, 'standby');
					}
					else if(line.includes('f:84:'))
					{
						var logicalAddress = line.substring(line.indexOf('>> ') + 3, line.indexOf('f:84:'));
						if(logicalAddress && logicalAddress.length === 1)
						{
							ctl_debug('Received report address request on broadcast');
							var lineCmd = line.split('>> ')[1];

							if(
								this.devices.hasOwnProperty('dev' + logicalAddress)
								&& this.devices['dev' + logicalAddress].address === 'f.f.f.f'
								&& lineCmd.endsWith(`:0${logicalAddress}`)
							) {
								var addArr = lineCmd.substring(
									lineCmd.indexOf('f:84:') + 5, lineCmd.indexOf(`:0${logicalAddress}`)
								).split(':');

								if(addArr.length === 2)
								{
									var newAddr = addArr[0].charAt(0) + '.' + addArr[0].charAt(1) +
										'.' + addArr[1].charAt(0) + '.' + addArr[1].charAt(1);

									this.devices['dev' + logicalAddress].address = newAddr;
									ctl_debug(`Updated dev${logicalAddress} address to: ${newAddr}`);
								}
							}

							if(line.includes(`>> ${logicalAddress}f:84:`))
								this._checkDevicesStatus(`dev${logicalAddress}`);
						}
					}
				}
				else if(line.includes('<<') && !this.togglingPower)
				{
					var srcAddress = this.devices[this.myDevice].logicalAddress;
					var destAddress = this.devices[this.controlledDevice].logicalAddress;

					if(line.includes(`<< ${srcAddress}0:04`))
					{
						if(this.devices[this.myDevice].activeSource !== 'yes')
							ctl_debug(`Updated dev${srcAddress} activeSource using stdout to: yes`);

						this.devices[this.myDevice].activeSource = 'yes';

						this.cec.emit(`${srcAddress}:activeSource`, 'yes');
					}
					else if(line.includes(`<< ${srcAddress}0:9d`))
					{
						if(this.devices[this.myDevice].activeSource !== 'no')
							ctl_debug(`Updated dev${srcAddress} activeSource using stdout to: no`);

						this.devices[this.myDevice].activeSource = 'no';
						this.cec.emit(`${srcAddress}:activeSource`, 'no');
					}
					else if(line.includes(`<< ${srcAddress}${destAddress}:44`))
					{
						var value = this._getLineValue(line).toUpperCase();
						var keyName = keymap.getName(value);

						ctl_debug(`Send "${keyName}" key to dev${destAddress}`);
						this.cec.emit('sendKey', keyName);
					}
				}
			}
		});
	}

	_getLineValue(line)
	{
		var lineArray = line.split(':');
		return lineArray[lineArray.length - 1].trim();
	}

	_getDeviceFunctions(deviceId)
	{
		var func = {
			turnOn: this.changePower.bind(this, deviceId, 'on'),
			turnOff: this.changePower.bind(this, deviceId, 'standby'),
			togglePower: this.togglePower.bind(this, deviceId)
		};

		if(this.devices[deviceId].name === 'TV')
		{
			func.changeSource = (number) =>
			{
				if(isNaN(number) || number < 0)
				{
					this.sourceNumber = (this.sourceNumber < this.hdmiPorts) ? this.sourceNumber + 1 : 0;
					number = this.sourceNumber;
				}

				var srcAddress = this.devices[this.myDevice].logicalAddress;
				var destAddress = (this.broadcast === false) ? this.devices[deviceId].logicalAddress : 'F';

				return this.command(`tx ${srcAddress}${destAddress}:82:${number}0:00`, null);
			}
		}

		if(this.devices[deviceId] !== this.devices[this.myDevice])
		{
			func.sendKey = (keyName) =>
			{
				this.controlledDevice = deviceId;

				var srcAddress = this.devices[this.myDevice].logicalAddress;
				var destAddress = this.devices[deviceId].logicalAddress;

				return new Promise((resolve, reject) =>
				{
					var keyHex = keymap.getHex(keyName);

					if(!keyHex)
					{
						ctl_debug(`Unknown key name: ${keyName}`);
						resolve(null);
					}
					else
					{
						var sendKeyTimeout = setTimeout(() =>
						{
							sendKeyTimeout = null;
							ctl_debug(`dev${destAddress} send key timed out!`);
							sendKeyHandler(null);
						}, 1000);

						var sendKeyHandler = (value) =>
						{
							if(value === keyName || value === null)
							{
								if(sendKeyTimeout)
									clearTimeout(sendKeyTimeout);

								this.cec.removeListener('sendKey', sendKeyHandler);

								if(!value)
								{
									ctl_debug(`dev${destAddress} could not receive key!`);
									resolve(null);
								}
								else
									resolve(true);
							}
						}

						this.cec.on('sendKey', sendKeyHandler);

						var sendCmd = `tx ${srcAddress}${destAddress}:44:${keyHex}`;
						ctl_debug(`Command: ${sendCmd}`);
						this.command(sendCmd, null);
					}
				});
			}
		}

		return func;
	}

	_getGlobalFunctions()
	{
		return {
			setActive: this.changeActive.bind(this, 'yes'),
			setInactive: this.changeActive.bind(this, 'no'),
			volumeUp: this.command.bind(this, 'volup', null),
			volumeDown: this.command.bind(this, 'voldown', null),
			mute: this.command.bind(this, 'mute', null),
			getKeyNames: keymap.getNamesArray.bind(this),
			command: (args) => { return this.command(args, null); }
		}
	}

	command(action, logicalAddress)
	{
		return new Promise((resolve, reject) =>
		{
			if(!action || typeof action !== 'string') resolve(null);
			else
			{
				var cmd = '';
				if(logicalAddress) cmd = `${action} ${logicalAddress}`;
				else cmd = action;

				if(!this.togglingPower)
					ctl_debug(`Running command: ${cmd}`);

				this.client.stdin.write(cmd);

				this.client.stdout.once('data', () => resolve(true));
			}
		});
	}

	changePower(deviceId, powerStatus)
	{
		this.controlledDevice = deviceId;

		return new Promise((resolve, reject) =>
		{
			this.getStatus(deviceId).then(value =>
			{
				if(value === null) resolve(null);
				else if(value === powerStatus)
				{
					ctl_debug(`${deviceId} powerStatus is already in desired state`);
					resolve(powerStatus);
				}
				else
				{
					this.command(powerStatus, this.devices[deviceId].logicalAddress);

					var timedOut = false;
					var actionTimeout = setTimeout(() => timedOut = true, 40000);

					var waitPower = () =>
					{
						this.getStatus(deviceId).then(value =>
						{
							if(value !== powerStatus && !timedOut)
								return waitPower();

							clearTimeout(actionTimeout);
							this.togglingPower = false;

							if(timedOut)
							{
								ctl_debug(`${deviceId} powerStatus change timed out!`);
								resolve(null);
							}
							else
							{
								ctl_debug(`${deviceId} powerStatus changed to: ${powerStatus}`);
								resolve(powerStatus);
							}
						});
					}

					ctl_debug(`Waiting for ${deviceId} powerStatus change to: ${powerStatus}`);
					this.togglingPower = true;
					waitPower();
				}
			});
		});
	}

	togglePower(deviceId)
	{
		return new Promise((resolve, reject) =>
		{
			this.getStatus(deviceId).then(value =>
			{
				var action = (value === 'on') ? 'standby'
					: (value === 'standby') ? 'on' : null;

				if(action)
					this.changePower(deviceId, action).then(resolve);
				else
					resolve(null);
			});
		});
	}

	changeActive(isActiveSource)
	{
		return new Promise((resolve, reject) =>
		{
			var logicalAddress = this.devices[this.myDevice].logicalAddress;
			var activeSource = (isActiveSource === 'yes' || isActiveSource === true) ? 'yes' : 'no';

			if(this.devices[this.myDevice].activeSource === activeSource)
			{
				ctl_debug(`dev${logicalAddress} activeSource is already in desired state`);
				resolve(activeSource);
			}
			else
			{
				var action = (activeSource === 'yes') ? 'as' : 'is';

				var statusTimeout = setTimeout(() =>
				{
					ctl_debug(`dev${logicalAddress} activeSource change timed out!`);
					this.devices[this.myDevice].activeSource = null;
					this.cec.emit(`${logicalAddress}:activeSource`, null);
				}, 5000);

				this.cec.once(`${logicalAddress}:activeSource`, (value) =>
				{
					clearTimeout(statusTimeout);
					ctl_debug(`dev${logicalAddress} activeSource changed to: ${value}`);
					resolve(value);
				});

				this.command(action, null);
			}
		});
	}

	getStatus(deviceId)
	{
		this.controlledDevice = deviceId;

		return new Promise((resolve, reject) =>
		{
			var logicalAddress = this.devices[deviceId].logicalAddress;

			var statusTimeout = setTimeout(() =>
			{
				if(!this.togglingPower)
				{
					ctl_debug(`dev${logicalAddress} getStatus timed out!`);
					this.devices[deviceId].powerStatus = null;
				}

				this.cec.emit(`${logicalAddress}:powerStatus`, null);
			}, 6000);

			this.cec.once(`${logicalAddress}:powerStatus`, (value) =>
			{
				clearTimeout(statusTimeout);

				if(!this.togglingPower)
					ctl_debug(`dev${logicalAddress} powerStatus is: ${value}`);

				resolve(value);
			});

			this.command(`pow ${logicalAddress}`);
		});
	}

	async _checkDevicesStatus(deviceId, wantedStatus)
	{
		if(this.runningCheckStatus) return;

		this.runningCheckStatus = true;

		var checkRequired = () =>
		{
			if(
				typeof this.devices[deviceId] === 'object'
				&& this.devices[deviceId].hasOwnProperty('powerStatus')
				&& this.devices[deviceId].powerStatus !== wantedStatus
				&& deviceId !== this.myDevice
			)
				return true;

			return false;
		}

		if(deviceId && checkRequired())
		{
			await this.getStatus(deviceId);
		}
		else
		{
			for(var deviceId in this.devices)
			{
				if(checkRequired())
					await this.getStatus(deviceId);
			}
		}

		this.runningCheckStatus = false;
	}
}
