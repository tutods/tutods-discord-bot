import { TextChannel } from 'discord.js';
import { discordEnv } from '../../configs/environment';
import { RunFunction } from '../../interfaces/ICommand';
import { currencyConverter } from '../../services/CurrencyConverter';

export const run: RunFunction = async (client, message) => {
	const args = message.content
		.slice(discordEnv.prefix.length)
		.trim()
		.split(/\s+/g)
		.slice(1);

	const messageChannel: TextChannel = message.channel as TextChannel;

	try {
		await message.delete();
	} catch {}

	const result = currencyConverter(
		args[0],
		args[1],
		Number(parseFloat(args[2]).toFixed(2))
	);
};

export const name: string = 'convert';
