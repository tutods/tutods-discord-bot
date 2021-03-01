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
			await messageChannel.send(
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
	}

	// Have user
	if (user) {
		console.log('HAVEMOS USER');
		// Get only user ID
		const userId = user.replace('<', '').replace('>', '').replace('@!', '');

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
		// Delete messages
		messageChannel.bulkDelete(number).catch(async (err) => {
			const targetChannel = message.guild.channels.cache.get(
				discord.logChannelId
			);

			if (targetChannel) {
				await targetChannel.send(
					new MessageEmbed({ color: 'RED' })
						.setDescription('Upps! Not possible delete messages!')
						.setTitle('❌ Error')
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
			}
		});
	}

	// else {
	// 	// Delete messages
	// 	messageChannel.bulkDelete(number).catch(async (err) => {
	// 		await messageChannel.send(
	// 			new MessageEmbed({ color: 'RED' })
	// 				.setDescription(err)
	// 				.setTitle('❌ Error')
	// 				.setFooter(
	// 					`${message.author.tag} • ${formatCreatedAt(
	// 						message.createdAt
	// 					)}`,
	// 					message.author.displayAvatarURL({
	// 						format: 'png',
	// 						dynamic: true,
	// 					})
	// 				)
	// 		);
	// 	});
};

export const name: string = 'purge';
