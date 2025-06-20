export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 number, 1 symbol
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
  return password.length >= 8 && passwordRegex.test(password);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};