import consola, { Consola } from 'consola';
import {
	Client,
	Collection,
	Intents,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { formatCreatedAt } from '../functions/FormatCreatedAt';
import { ICommand } from '../interfaces/ICommand';
import { IConfig } from '../interfaces/IConfig';
import { IEvent } from '../interfaces/IEvent';

const globPromise = promisify(glob);

class Bot extends Client {
	public config: IConfig;

	public logger: Consola = consola;

	public commands: Collection<string, ICommand> = new Collection();
	public events: Collection<string, IEvent> = new Collection();

	public constructor() {
		super({
			ws: { intents: Intents.ALL },
			messageCacheLifetime: 180,
			messageCacheMaxSize: 200,
			messageSweepInterval: 180,
			messageEditHistoryMaxSize: 200,
		});
	}

	public async start(env: IConfig): Promise<void> {
		this.config = env;

		this.login(env.token);

		const commandFiles: string[] = await globPromise(
			`${__dirname}/../commands/**/*.{ts,js}`
		);

		commandFiles.map(async (value: string) => {
			const file: ICommand = await import(value);

			this.commands.set(file.name, file);
		});

		const eventsFiles: string[] = await globPromise(
			`${__dirname}/../events/**/*.{ts,js}`
		);

		eventsFiles.map(async (value: string) => {
			const file: IEvent = await import(value);

			this.events.set(file.name, file);
			this.on(file.name, file.run.bind(null, this));
		});
	}

	public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
		return new MessageEmbed({ ...options, color: 'RANDOM' }).setFooter(
			`${message.author.tag} • ${formatCreatedAt(message.createdAt)}`,
			message.author.displayAvatarURL({ format: 'png', dynamic: true })
		);
	}
}

export { Bot };
