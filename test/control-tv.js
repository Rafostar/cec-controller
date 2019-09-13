/*
   Use arrow keys from your PC as arrows buttons to control TV.
*/

const cecInit = require('./shared/init');
cecInit().then(test);

function test(obj)
{
	process.stdin.setRawMode(true);
	process.stdin.setEncoding('utf8');

	console.log('--- Control TV with keyboard arrow keys, select with "Enter" ---\n');

	process.stdin.on('data', (key) =>
	{
		/* Read arrow keys */
		if(key.charCodeAt(0) === 27 && key.charCodeAt(1) === 91)
		{
			switch(key.charCodeAt(2))
			{
				case 65:
					obj.controller.dev0.sendKey('up');
					break;
				case 66:
					obj.controller.dev0.sendKey('down');
					break;
				case 67:
					obj.controller.dev0.sendKey('right');
					break;
				case 68:
					obj.controller.dev0.sendKey('left');
					break;
				default:
					break;
			}
		}
		else if(key === '\u0003') 
		{
			switch(key)
			{
				case '\u23CE': // Select with "Enter"
					obj.controller.dev0.sendKey('select');
					break;
				case '\u0003': // Close with "Ctrl+c"
					obj.cec.closeClient().then(() => process.exit());
					break;
				default:
					break;
			}
		}
	});
}
