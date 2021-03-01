import { TextChannel } from 'discord.js';
import { discord } from '../../configs/environment';
import { ETitleType } from '../../enums/ETitleType';
import { LogToChannel } from '../../functions/Log';
import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message) => {
	const args = message.content
		.slice(discord.prefix.length)
		.trim()
		.split(/\s+/g)
		.slice(1);

	const messageChannel: TextChannel = message.channel as TextChannel;
	try {
		await message.delete();
	} catch {}

	// Validate if user have permissions to manage messages
	if (!message.member.hasPermission('MANAGE_MESSAGES')) {
		return;
	}

	// Validate if is a text channel
	if (!message.channel.isText()) {
		return;
	}

	let number = 1;
	let user = undefined;

	// Pass args (for example number or user)
	if (args.length > 0) {
		// Verify if have number or only number
		if (args[0].includes('<@')) {
			user = args[0];
		} else {
			number = Number(args[0]);
			user = args[1] || undefined;
		}

		// Warning to limit of messages to delete
		if (number > 100) {
			new LogToChannel(client, message).post(
				ETitleType.Warning,
				`The limit of messages to delete is 100.\nPlease try again!`
			);

			return;
		}
	}

	// Have user
	if (user) {
		// Get only user ID
		const userId = user.replace('<', '').replace('>', '').replace('@!', '');

		message.channel.messages
			.fetch({
				limit: 100,
			})
			.then((messages) => {
				const messagesToDelete = [];
				let userData = undefined;

				messages
					.filter((m) => m.author.id === userId)
					.map((msg) => {
						userData = msg.author.username;

						if (messagesToDelete.length <= number - 1)
							messagesToDelete.push(msg);
					});

				messageChannel
					.bulkDelete(messagesToDelete)
					.then(async () => {
						await new LogToChannel(client, message).post(
							ETitleType.Info,
							`**${message.author.username}** request delete ${number} messages of **${userData}**!`,
							discord.logChannelId
						);
					})
					.catch(async (err) => {
						await new LogToChannel(client, message).post(
							ETitleType.Error,
							`Error deleting messages: ${err}`,
							discord.logChannelId
						);
					});
			});
	} else {
		// Delete messages
		messageChannel.bulkDelete(number).catch(async (err) => {
			await new LogToChannel(client, message).post(
				ETitleType.Error,
				`Error deleting messages: ${err}`,
				discord.logChannelId
			);
		});
	}
};

export const name: string = 'purge';
