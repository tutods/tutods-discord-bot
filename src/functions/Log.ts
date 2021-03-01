import { Client, Message, MessageEmbed, TextChannel } from 'discord.js';
import { discordEnv } from '../configs/environment';
import { ETitleType } from '../enums/ETitleType';
import { formatCreatedAt } from './FormatCreatedAt';

class LogToChannel {
	public client: Client;
	public message: Message;

	constructor(client: Client, message: Message) {
		this.client = client;
		this.message = message;
	}

	post(title: ETitleType, description: string, channelId?: string): void {
		if (channelId) {
			const targetChannel = this.message.guild.channels.cache.get(
				discordEnv.logChannelId
			) as TextChannel;

			if (targetChannel) {
				targetChannel.send(
					new MessageEmbed({ color: 'RANDOM' })
						.setDescription(description)
						.setTitle(title)
						.setFooter(
							`${this.message.author.tag} • ${formatCreatedAt(
								this.message.createdAt
							)}`,
							this.message.author.displayAvatarURL({
								format: 'png',
								dynamic: true,
							})
						)
				);
			}
		} else {
			this.message.channel.send(
				new MessageEmbed({
					color:
						title === ETitleType.Error
							? 'RED'
							: title === ETitleType.Info
							? 'BlUE'
							: 'YELLOW',
				})
					.setDescription(description)
					.setTitle(title)
					.setFooter(
						`${this.message.author.tag} • ${formatCreatedAt(
							this.message.createdAt
						)}`,
						this.message.author.displayAvatarURL({
							format: 'png',
							dynamic: true,
						})
					)
			);
		}
	}
}

export { LogToChannel };
