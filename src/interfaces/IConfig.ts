export interface IDiscordEnv {
	token: string;
	prefix: string;
	logChannelId: string;
}

export interface IApisEnv {
	currencyApi: {
		baseUrl: string;
		apiKey: string;
	};

	githubApi: {
		baseUrl: string;
	};
}
