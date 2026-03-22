export const validateAadhaar = (aadhaar) => {
  const regex = /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/;
  if (!regex.test(aadhaar)) return false;
  // A simple representation of Luhn-style check could go here if needed
  return true;
};

export const validateMobile = (mobile) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(mobile);
};

export const validateEmail = (email) => {
  if (!email) return true; // Optional field, only validate if provided
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateDescription = (desc) => {
  return desc && desc.length >= 50;
};

export const validateDate = (dateStr) => {
  if (!dateStr) return false;
  const inputDate = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate <= today;
};
