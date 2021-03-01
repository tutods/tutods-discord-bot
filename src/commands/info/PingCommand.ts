import { Message } from 'discord.js';
import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message) => {
	const msg: Message = await message.channel.send(
		client.embed({ description: 'your ping!' }, message)
	);

	const timeCalc = msg.createdTimestamp - message.createdTimestamp;

	await msg.edit(
		client.embed(
			{
				description: `**WebSocket:** ${client.ws.ping}MS\n**Message edit:** ${timeCalc}`,
			},
			message
		)
	);
	message.delete({ timeout: 0 });
};

export const name: string = 'ping';
