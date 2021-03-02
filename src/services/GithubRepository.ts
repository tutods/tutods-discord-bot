import axios from 'axios';
import { apisEnv } from '../configs/environment';
import { IGithubRepository } from '../interfaces/IGithubRepository';

const getGithubRepo = (info: string): Promise<IGithubRepository> => {
	const { baseUrl } = apisEnv.githubApi;
	console.log(`${baseUrl}/repos/${info}`);
	const result = axios
		.get(`${baseUrl}/repos/${info}`)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			return null;
		});

	return result;
};

export { getGithubRepo };
