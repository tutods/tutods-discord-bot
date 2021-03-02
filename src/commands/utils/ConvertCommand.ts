import { MessageEmbed, TextChannel } from 'discord.js';
import { ECoinEmoji } from '../../enums/ECoinEmoji';
import { ECoinSymbol } from '../../enums/ECoinSymbol';
import { ETitleType } from '../../enums/ETitleType';
import { LogToChannel } from '../../functions/Log';
import { RunFunction } from '../../interfaces/ICommand';
import { currencyConverter } from '../../services/CurrencyConverter';

export const run: RunFunction = async (client, message, args) => {
	const messageChannel: TextChannel = message.channel as TextChannel;

	const log = new LogToChannel(client, message);

	try {
		await message.delete();
	} catch {}

	if (args.length < 3) {
		// Invalid command usage
		log.post(
			ETitleType.Error,
			`**Invalid command usage!**\n You need send 3 parameters, current currency, converted currency and amount to convert`
		);
		return;
	}

	/**
	 * Validate if
	 * arg 0/1 not give a NaN
	 * arg 2 give a NaN
	 */
	if (
		!isNaN(parseInt(args[0])) ||
		!isNaN(parseInt(args[1])) ||
		isNaN(parseInt(args[2]))
	) {
		console.log('Entrou');
		// Invalid Command usage
		log.post(
			ETitleType.Error,
			`**Invalid command usage!**\n You need send 3 parameters, current currency, converted currency and amount to convert`
		);

		return;
	}

	const fromCoin = args[0].toUpperCase();
	const toCoin = args[1].toUpperCase();
	const amount = Number(args[2]).toFixed(2);

	const result = await currencyConverter(fromCoin, toCoin, amount);

	messageChannel.send(
		new MessageEmbed({ color: 'BLUE' })
			.setTitle(
				`Conversion from ${ECoinSymbol[fromCoin]} to ${ECoinSymbol[toCoin]}`
			)
			.addFields(
				{
					name: `${ECoinEmoji[fromCoin]} ${fromCoin}`,
					value: `${amount} ${ECoinSymbol[fromCoin]}`,
					inline: true,
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true,
				},
				{
					name: `${ECoinEmoji[toCoin]} ${toCoin}`,
					value: `${result.result.toFixed(2)} ${ECoinSymbol[toCoin]}`,
					inline: true,
				}
			)
	);
};

export const name: string = 'convert';
