import { IApisEnv, IDiscordEnv } from '../interfaces/IConfig';
import * as config from './../../config.json';

const { discord, apis } = config;

export const discordEnv: IDiscordEnv = {
	token: discord.token || '',
	prefix: discord.prefix || '!',
	logChannelId: discord.logChannelId,
};

export const apisEnv: IApisEnv = {
	currencyApi: apis.currencyApi,
	githubApi: apis.githubApi,
};
