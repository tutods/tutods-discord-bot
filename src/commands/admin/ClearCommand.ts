import { TextChannel } from 'discord.js';
import { discord } from '../../configs/environment';
import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message) => {
	const args = Number(
		message.content
			.slice(discord.prefix.length)
			.trim()
			.split(/\s+/g)
			.slice(1)[0]
	);

	message.delete();

	if (!args) {
		await message.channel.send(
			client.embed(
				{
					description:
						'Please specify a number of messages to delete',
				},
				message
			)
		);

		return;
	}

	if (!message.member.hasPermission('MANAGE_MESSAGES')) {
		return;
	}

	if (!message.channel.isText()) {
		return;
	}

	const messageChannel: TextChannel = message.channel as TextChannel;

	let channel = client.channels.get('channelid') as TextChannel;

	messageChannel.bulkDelete(args).catch(async (err) => {
		await message.channel.send(
			client.embed(
				{
					description: `Error: ${err}`,
				},
				message
			)
		);
	});
};

export const name: string = 'purge';
