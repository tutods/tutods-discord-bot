import axios from 'axios';
import { apisEnv } from '../configs/environment';
import { IGithubRepository } from '../interfaces/IGithubRepository';

const getGithubRepo = (info: string): Promise<IGithubRepository> => {
	const { baseUrl } = apisEnv.githubApi;

	const result = axios
		.get(`${baseUrl}/repos/${info}`)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.log(err);
			return;
		});

	return result;
};

export { getGithubRepo };
