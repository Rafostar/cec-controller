/*
   Use arrow keys from your PC as arrows buttons to control TV.
*/

const cecInit = require('./shared/init');
cecInit().then(test);

process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');

var enabled = true;

function test(obj)
{
	console.log('--- Control dev1 with keyboard arrow keys, select with "Spacebar" ---\n');

	process.stdin.on('data', async(key) =>
	{
		if(!enabled) return;

		enabled = false;

		/* Read arrow keys */
		if(key.charCodeAt(0) === 27 && key.charCodeAt(1) === 91)
		{
			switch(key.charCodeAt(2))
			{
				case 65:
					await obj.controller.dev1.sendKey('up');
					break;
				case 66:
					await obj.controller.dev1.sendKey('down');
					break;
				case 67:
					await obj.controller.dev1.sendKey('right');
					break;
				case 68:
					await obj.controller.dev1.sendKey('left');
					break;
				default:
					break;
			}
		}
		else
		{
			switch(key)
			{
				case '\u0020': // "Enter" key
					await obj.controller.dev1.sendKey('select');
					break;
				case '\u0003': // Close with "Ctrl+c"
					/* In stdin RAW mode spawned process will not be closed on exit and must be closed manually */
					obj.cec.closeClient().then(() => process.exit(0));
					break;
				default:
					break;
			}
		}

		enabled = true;
	});
}
