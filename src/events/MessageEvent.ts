import { Message } from 'discord.js';
import { discordEnv } from '../configs/environment';
import { ETitleType } from '../enums/ETitleType';
import { LogToChannel } from '../functions/Log';
import { ICommand } from '../interfaces/ICommand';
import { RunFunction } from '../interfaces/IEvent';

export const run: RunFunction = async (client, message: Message) => {
	const log = new LogToChannel(client, message);

	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLocaleLowerCase().startsWith(discordEnv.prefix)
	) {
		return;
	}

	const args: string[] = message.content
		.slice(discordEnv.prefix.length)
		.trim()
		.split(/ +/g);

	const cmd: string = args.shift();

	const command: ICommand = client.commands.get(cmd);
	if (!command) return;

	command.run(client, message, args).catch((err) => {
		log.post(ETitleType.Error, `Error: ${err}`, discordEnv.logChannelId);
	});
};

export const name: string = 'message';
