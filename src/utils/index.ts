export const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.match(regex)) return true;
    return false;
};

export const isDateValid = (date: string): boolean => {
    const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

    if (date.match(regex)) return true;
    return false;
};

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
    const regex = /^\+[1-9]\d{10,14}$/;

    if (phoneNumber.match(regex)) return true;
    return false;
};
