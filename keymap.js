module.exports = (value) =>
{
	var keyName;

	switch(value)
	{
		case '00':
			keyName = 'select';
			break;
		case '01':
			keyName = 'up';
			break;
		case '02':
			keyName = 'down';
			break;
		case '03':
			keyName = 'left';
			break;
		case '04':
			keyName = 'right';
			break;
		case '05':
			keyName = 'right-up';
			break;
		case '06':
			keyName = 'right-down';
			break;
		case '07':
			keyName = 'left-up';
			break;
		case '08':
			keyName = 'left-down';
			break;
		case '09':
			keyName = 'root-menu';
			break;
		case '0A':
			keyName = 'setup-menu';
			break;
		case '0B':
			keyName = 'contents-menu';
			break;
		case '0C':
			keyName = 'favorite-menu';
			break;
		case '0D':
			keyName = 'exit';
			break;
		case '0E':
			keyName = '0x0E';
			break;
		case '0F':
			keyName = '0x0F';
			break;
		case '10':
			keyName = '0x10';
			break;
		case '11':
			keyName = '0x11';
			break;
		case '12':
			keyName = '0x12';
			break;
		case '13':
			keyName = '0x13';
			break;
		case '14':
			keyName = '0x14';
			break;
		case '15':
			keyName = '0x15';
			break;
		case '16':
			keyName = '0x16';
			break;
		case '17':
			keyName = '0x17';
			break;
		case '18':
			keyName = '0x18';
			break;
		case '19':
			keyName = '0x19';
			break;
		case '1A':
			keyName = '0x1A';
			break;
		case '1B':
			keyName = '0x1B';
			break;
		case '1C':
			keyName = '0x1C';
			break;
		case '1D':
			keyName = '0x1D';
			break;
		case '1E':
			keyName = '0x1E';
			break;
		case '1F':
			keyName = '0x1F';
			break;
		case '20':
			keyName = '0';
			break;
		case '21':
			keyName = '1';
			break;
		case '22':
			keyName = '2';
			break;
		case '23':
			keyName = '3';
			break;
		case '24':
			keyName = '4';
			break;
		case '25':
			keyName = '5';
			break;
		case '26':
			keyName = '6';
			break;
		case '27':
			keyName = '7';
			break;
		case '28':
			keyName = '8';
			break;
		case '29':
			keyName = '9';
			break;
		case '2A':
			keyName = 'dot';
			break;
		case '2B':
			keyName = 'enter';
			break;
		case '2C':
			keyName = 'clear';
			break;
		case '2D':
			keyName = '0x2D';
			break;
		case '2E':
			keyName = '0x2E';
			break;
		case '2F':
			keyName = 'next-favorite';
			break;
		case '30':
			keyName = 'channel-up';
			break;
		case '31':
			keyName = 'channel-down';
			break;
		case '32':
			keyName = 'previous-channel';
			break;
		case '33':
			keyName = 'sound-select';
			break;
		case '34':
			keyName = 'input-select';
			break;
		case '35':
			keyName = 'display-info';
			break;
		case '36':
			keyName = 'help';
			break;
		case '37':
			keyName = 'page-up';
			break;
		case '38':
			keyName = 'page-down';
			break;
		case '39':
			keyName = '0x39';
			break;
		case '3A':
			keyName = '0x3A';
			break;
		case '3B':
			keyName = '0x3B';
			break;
		case '3C':
			keyName = '0x3C';
			break;
		case '3D':
			keyName = '0x3D';
			break;
		case '3E':
			keyName = '0x3E';
			break;
		case '3F':
			keyName = '0x3F';
			break;
		case '40':
			keyName = 'power';
			break;
		case '41':
			keyName = 'volume-up';
			break;
		case '42':
			keyName = 'volume-down';
			break;
		case '43':
			keyName = 'mute';
			break;
		case '44':
			keyName = 'play';
			break;
		case '45':
			keyName = 'stop';
			break;
		case '46':
			keyName = 'pause';
			break;
		case '47':
			keyName = 'record';
			break;
		case '48':
			keyName = 'rewind';
			break;
		case '49':
			keyName = 'fast-forward';
			break;
		case '4A':
			keyName = 'eject';
			break;
		case '4B':
			keyName = 'forward';
			break;
		case '4C':
			keyName = 'backward';
			break;
		case '4D':
			keyName = 'stop-record';
			break;
		case '4E':
			keyName = 'pause-record';
			break;
		case '4F':
			keyName = '0x4F';
			break;
		case '50':
			keyName = 'angle';
			break;
		case '51':
			keyName = 'subtitle';
			break;
		case '52':
			keyName = 'vod';
			break;
		case '53':
			keyName = 'epg';
			break;
		case '54':
			keyName = 'timer';
			break;
		case '55':
			keyName = 'initial-config';
			break;
		case '56':
			keyName = '0x56';
			break;
		case '57':
			keyName = '0x57';
			break;
		case '58':
			keyName = '0x58';
			break;
		case '59':
			keyName = '0x59';
			break;
		case '5A':
			keyName = '0x5A';
			break;
		case '5B':
			keyName = '0x5B';
			break;
		case '5C':
			keyName = '0x5C';
			break;
		case '5D':
			keyName = '0x5D';
			break;
		case '5E':
			keyName = '0x5E';
			break;
		case '5F':
			keyName = '0x5F';
			break;
		case '60':
			keyName = 'play-function';
			break;
		case '61':
			keyName = 'pause-play-function';
			break;
		case '62':
			keyName = 'record-function';
			break;
		case '63':
			keyName = 'pause-record-function';
			break;
		case '64':
			keyName = 'stop-function';
			break;
		case '65':
			keyName = 'mute-function';
			break;
		case '66':
			keyName = 'restore-volume-function';
			break;
		case '67':
			keyName = 'tune-function';
			break;
		case '68':
			keyName = 'select-media-function';
			break;
		case '69':
			keyName = 'select-av-function';
			break;
		case '6A':
			keyName = 'select-audio-function';
			break;
		case '6B':
			keyName = 'power-toggle-function';
			break;
		case '6C':
			keyName = 'power-off-function';
			break;
		case '6D':
			keyName = 'power-on-function';
			break;
		case '6E':
			keyName = '0x6E';
			break;
		case '6F':
			keyName = '0x6F';
			break;
		case '70':
			keyName = '0x70';
			break;
		case '71':
			keyName = 'blue';
			break;
		case '72':
			keyName = 'red';
			break;
		case '73':
			keyName = 'green';
			break;
		case '74':
			keyName = 'yellow';
			break;
		case '75':
			keyName = 'F5';
			break;
		case '76':
			keyName = 'data';
			break;
		default:
			keyName = value;
			break;
	}

	return keyName;
}
