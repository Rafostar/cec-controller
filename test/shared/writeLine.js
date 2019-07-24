module.exports = (text) =>
{
	process.stdout.cursorTo(0);
	process.stdout.clearLine(0);
	process.stdout.write(text);
}
