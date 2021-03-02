import axios from 'axios';
import { apisEnv } from '../configs/environment';
import { ICurrencyResult } from '../interfaces/ICurrencyResult';

const currencyConverter = (
	from: string,
	to: string,
	amount: string
): Promise<ICurrencyResult> => {
	const { baseUrl, apiKey } = apisEnv.currencyApi;

	const result = axios
		.get(`${baseUrl}/${apiKey}/pair/${from}/${to}`, {
			params: { amount: amount },
		})
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.log(err);
			return;
		});

	return result;
};

export { currencyConverter };
