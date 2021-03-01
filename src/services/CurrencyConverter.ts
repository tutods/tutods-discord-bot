import axios from 'axios';
import { apisEnv } from '../configs/environment';
import { ICurrencyResult } from '../interfaces/ICurrencyResult';

const currencyConverter = (
	from: string,
	to: string,
	amount: string
): Promise<ICurrencyResult> => {
	const params = {
		from,
		to,
		amount: amount,
	};

	const converted = axios
		.get(`${apisEnv.currencyApi}/convert`, { params })
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.log(err);
			return;
		});

	return converted;
};

export { currencyConverter };
