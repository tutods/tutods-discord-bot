const formatDate = (date: string, time = false): string => {
	const newDate = new Date(date);

	const msgDate = newDate.toLocaleDateString('pt-PT', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	const msgTime = newDate.toLocaleTimeString('pt-PT', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	return `${msgDate}${time ? ' ' + msgTime : ''}`;
};

export { formatDate };
