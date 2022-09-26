export const dateValidator = (date: string): boolean => {
	const regex = /\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;

	if (date.match(regex) && date.length === 10) return true;

	return false;
};

export const phoneNumberValidator = (phoneNumber: string): boolean => {
	const regex = /^\+[1-9]\d{10,14}$/;

	if (phoneNumber.match(regex)) return true;

	return false;
};
