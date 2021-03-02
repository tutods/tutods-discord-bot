import { RunFunction } from '../../interfaces/ICommand';

export const run: RunFunction = async (client, message) => {
	await message.channel.send(
		client.embed(
			{
				description: `**Your Ping is** ${client.ws.ping}ms`,
			},
			message
		)
	);
	message.delete({ timeout: 0 });
};

export const name: string = 'ping';
