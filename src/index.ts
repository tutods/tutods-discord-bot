import { Bot } from './client/Client';
import { discordEnv } from './configs/environment';

new Bot().start(discordEnv);
