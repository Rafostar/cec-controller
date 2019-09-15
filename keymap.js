module.exports =
{
	getName: function(hex)
	{
		return (keyNames[hex]) ? keyNames[hex] : `0x${hex}`;
	},

	getHex: function(name)
	{
		return Object.keys(keyNames).find(hex => keyNames[hex] === name);
	},

	getNamesArray: function()
	{
		return new Promise((resolve) =>
		{
			resolve(Object.values(keyNames));
		});
	}
}

const keyNames =
{
	'00': 'select',
	'01': 'up',
	'02': 'down',
	'03': 'left',
	'04': 'right',
	'05': 'right-up',
	'06': 'right-down',
	'07': 'left-up',
	'08': 'left-down',
	'09': 'root-menu',
	'0A': 'setup-menu',
	'0B': 'contents-menu',
	'0C': 'favorite-menu',
	'0D': 'exit',
	'20': '0',
	'21': '1',
	'22': '2',
	'23': '3',
	'24': '4',
	'25': '5',
	'26': '6',
	'27': '7',
	'28': '8',
	'29': '9',
	'2A': 'dot',
	'2B': 'enter',
	'2C': 'clear',
	'2F': 'next-favorite',
	'30': 'channel-up',
	'31': 'channel-down',
	'32': 'previous-channel',
	'33': 'sound-select',
	'34': 'input-select',
	'35': 'display-info',
	'36': 'help',
	'37': 'page-up',
	'38': 'page-down',
	'40': 'power',
	'41': 'volume-up',
	'42': 'volume-down',
	'43': 'mute',
	'44': 'play',
	'45': 'stop',
	'46': 'pause',
	'47': 'record',
	'48': 'rewind',
	'49': 'fast-forward',
	'4A': 'eject',
	'4B': 'forward',
	'4C': 'backward',
	'4D': 'stop-record',
	'4E': 'pause-record',
	'50': 'angle',
	'51': 'subtitle',
	'52': 'vod',
	'53': 'epg',
	'54': 'timer',
	'55': 'initial-config',
	'60': 'play-function',
	'61': 'pause-play-function',
	'62': 'record-function',
	'63': 'pause-record-function',
	'64': 'stop-function',
	'65': 'mute-function',
	'66': 'restore-volume-function',
	'67': 'tune-function',
	'68': 'select-media-function',
	'69': 'select-av-function',
	'6A': 'select-audio-function',
	'6B': 'power-toggle-function',
	'6C': 'power-off-function',
	'6D': 'power-on-function',
	'71': 'blue',
	'72': 'red',
	'73': 'green',
	'74': 'yellow',
	'75': 'F5',
	'76': 'data'
}
