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
import { ICommand } from '../interfaces/ICommand';
import { IDiscord } from '../interfaces/IDiscord';
import { IEvent } from '../interfaces/IEvent';

const globPromise = promisify(glob);

class Bot extends Client {
	public config: IDiscord;

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

	public async start(env: IDiscord): Promise<void> {
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
		const createdMsg: Date = message.createdAt;

		const msgDate = createdMsg.toLocaleDateString('pt-PT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});

		const msgTime = createdMsg.toLocaleTimeString('pt-PT', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});

		return new MessageEmbed({ ...options, color: 'RANDOM' }).setFooter(
			`${message.author.tag} • ${msgDate} ${msgTime}`,
			message.author.displayAvatarURL({ format: 'png', dynamic: true })
		);
	}
}

export { Bot };
