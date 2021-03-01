const formatCreatedAt = (createdAt: Date): string => {
	const msgDate = createdAt.toLocaleDateString('pt-PT', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	const msgTime = createdAt.toLocaleTimeString('pt-PT', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	return `${msgDate} ${msgTime}`;
};

export { formatCreatedAt };
