export interface IGithubRepository {
	full_name: string;
	name: string;
	private: false;
	owner: {
		url: string;
		followers_url: string;
		repos_url: string;
		login: string;
		avatar_url: string;
	};
	html_url: string;
	description: string;
	language: string;
	homepage: string;
	pushed_at: string;
	created_at: string;
	stargazers_count: number;
	watchers_count: number;
}
