import { TextChannel } from 'discord.js';
import { discordEnv } from '../../configs/environment';
import { ETitleType } from '../../enums/ETitleType';
import { LogToChannel } from '../../functions/Log';
import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message, args) => {
	const logToChannel = new LogToChannel(client, message);

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

	let count = 1;
	let user = undefined;

	if (args.length > 0) {
		if (message.mentions.users.first()) {
			user = message.mentions.users.first();
		}

		if (parseInt(args[0])) {
			count = parseInt(args[0]);
		}

		// Warning to limit of messages to delete
		if (count > 100) {
			logToChannel.post(
				ETitleType.Warning,
				`The limit of messages to delete is 100.\nPlease try again!`
			);

			return;
		}
	}

	// Have user
	if (user) {
		message.channel.messages
			.fetch({
				limit: 100,
			})
			.then((messages) => {
				const messagesToDelete = [];
				let userData = undefined;

				messages
					.filter((m) => m.author.id === user.id)
					.map((msg) => {
						if (messagesToDelete.length <= count - 1)
							messagesToDelete.push(msg);
					});

				messageChannel
					.bulkDelete(messagesToDelete)
					.then(async () => {
						logToChannel.post(
							ETitleType.Info,
							`**${message.author.username}** delete ${count} messages of **${user.username}**!`,
							discordEnv.logChannelId
						);
					})
					.catch(async (err) => {
						logToChannel.post(
							ETitleType.Error,
							`Error deleting messages: ${err}`,
							discordEnv.logChannelId
						);
					});
			});
	} else {
		// Delete messages
		messageChannel
			.bulkDelete(count)
			.then(async () => {
				logToChannel.post(
					ETitleType.Info,
					`**${message.author.username}** delete ${count} messages`,
					discordEnv.logChannelId
				);
			})
			.catch(async (err) => {
				logToChannel.post(
					ETitleType.Error,
					`Error deleting messages: ${err}`,
					discordEnv.logChannelId
				);
			});
	}
};

export const name: string = 'purge';
