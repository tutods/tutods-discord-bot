import { MessageEmbed, TextChannel } from 'discord.js';
import { ETitleType } from '../../enums/ETitleType';
import { formatDate } from '../../functions/FormatDate';
import { LogToChannel } from '../../functions/Log';
import { RunFunction } from '../../interfaces/ICommand';
import { getGithubRepo } from '../../services/GithubRepository';

export const run: RunFunction = async (client, message, args) => {
	const messageChannel: TextChannel = message.channel as TextChannel;
	const log = new LogToChannel(client, message);

	try {
		await message.delete();
	} catch {}

	if (args.length !== 1) {
		// Invalid command usage
		log.post(
			ETitleType.Error,
			`**Invalid command usage!**\n You need send 3 parameters, current currency, converted currency and amount to convert`
		);
		return;
	}

	if (!isNaN(parseInt(args[0]))) {
		// Invalid Command usage
		log.post(
			ETitleType.Error,
			`**Invalid command usage!**\n You need send 3 parameters, current currency, converted currency and amount to convert`
		);

		return;
	}

	const repoInfo = args[0];

	// API Request in GithubRepository service
	const result = await getGithubRepo(repoInfo);

	const finalHomeLink =
		result.homepage &&
		!['http', 'https'].some((el) => result.homepage.includes(el))
			? `http://${result.homepage}`
			: result.homepage;

	messageChannel.send(
		new MessageEmbed({ color: '#7A2F8F' })
			.setAuthor(`${message.author.username}`, message.author.avatarURL())
			.setFooter(
				`Repo created at • ${formatDate(
					result.created_at
				)}\nLast commit at • ${formatDate(result.pushed_at, true)}`
			)
			.setDescription(
				`**${message.author} shared a GitHub Repository:**\n
				**Description:** ${result.description}.\n
				${result.homepage && `🔗 **[Link](${finalHomeLink})**\n`}
				${
					result.stargazers_count >= 1 || result.stargazers_count
						? `**Number of stars:** ${result.stargazers_count}\n`
						: ''
				}
			`
			)
			.setThumbnail(result.owner.avatar_url)
			.addFields(
				{
					name: `Repository`,
					value: `[${result.name}](${result.html_url})`,
					inline: true,
				},
				{
					name: `Most Used Language`,
					value: `${result.language}`,
					inline: true,
				}
			)
	);
};

export const name: string = 'github';
