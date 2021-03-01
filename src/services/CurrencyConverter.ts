import axios from 'axios';
import { apisEnv } from '../configs/environment';

const currencyConverter = async (from: string, to: string, amount: number) => {
	const params = {
		from,
		to,
		amount: amount,
	};

	const converted = await axios
		.get(`${apisEnv.currencyApi}/convert`, { params })
		.then((response) => {
			return response.data;
		});

	console.log(converted);
};

export { currencyConverter };
