import { MessageEmbed, TextChannel } from 'discord.js';
import { discord } from '../../configs/environment';
import { formatCreatedAt } from '../../functions/FormatCreatedAt';
import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message) => {
	const args = message.content
		.slice(discord.prefix.length)
		.trim()
		.split(/\s+/g)
		.slice(1);

	message.delete();

	// Validate if user have permissions to manage messages
	if (!message.member.hasPermission('MANAGE_MESSAGES')) {
		return;
	}

	// Validate if is a text channel
	if (!message.channel.isText()) {
		return;
	}

	const messageChannel: TextChannel = message.channel as TextChannel;

	let number = 1;
	let user = null;

	// Pass args (for example number or user)
	if (args.length > 0) {
		// Verify if have number or only number
		if (args[0].includes('<@')) {
			user = args[0];
		} else {
			number = Number(args[0]);
			user = args[1] || null;
		}

		// Warning to limit of messages to delete
		if (number > 100) {
			await message.channel.send(
				new MessageEmbed({ color: 'YELLOW' })
					.setDescription(
						`The limit of messages to delete is 100.\nPlease try again!`
					)
					.setTitle('⚠️ Attention')
					.setFooter(
						`${message.author.tag} • ${formatCreatedAt(
							message.createdAt
						)}`,
						message.author.displayAvatarURL({
							format: 'png',
							dynamic: true,
						})
					)
			);

			return;
		}

		// Have user
		if (user) {
			console.log('HAVEMOS USER');
			// Get only user ID
			const userId = user
				.replace('<', '')
				.replace('>', '')
				.replace('@!', '');

			message.channel.messages
				.fetch({
					limit: 100,
				})
				.then((messages) => {
					const messagesToDelete = [];

					messages
						.filter((m) => m.author.id === userId)
						.map((msg) => {
							if (messagesToDelete.length <= number - 1)
								messagesToDelete.push(msg);
						});

					messageChannel
						.bulkDelete(messagesToDelete)
						.catch(async (err) => {
							await message.channel.send(
								client.embed(
									{
										description: `Error: ${err}`,
									},
									message
								)
							);
						});
				});
		} else {
			console.log(number);
			// Delete messages
			messageChannel.bulkDelete(number).catch(async (err) => {
				await message.channel.send(
					client.embed(
						{
							description: `Error: ${err}`,
						},
						message
					)
				);
			});
		}
	} else {
		// Delete messages
		messageChannel.bulkDelete(1).catch(async (err) => {
			await message.channel.send(
				client.embed(
					{
						description: `Error: ${err}`,
					},
					message
				)
			);
		});
	}
};

export const name: string = 'purge';
