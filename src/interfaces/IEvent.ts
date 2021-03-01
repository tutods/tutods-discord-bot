import { Bot } from '../client/Client';

export interface RunFunction {
	(client: Bot, ...args: any[]): Promise<void>;
}

export interface IEvent {
	name: string;
	run: RunFunction;
}
