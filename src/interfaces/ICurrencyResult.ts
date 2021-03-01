export interface ICurrencyResult {
	success: boolean;
	query: { from: string; to: string; amount: number };
	info: { rate: number };
	date: Date;
	result: number;
}
