import { IConfig } from '../interfaces/IConfig';
import * as config from './../../config.json';

export const discord: IConfig = {
	token: config.token || '',
	prefix: config.prefix || '!',
	adminLogChannel: config.adminLogChannel || 'logs',
};
