import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '../config/constants';

// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }

  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL };
  }

  return { isValid: true };
}

// Phone number validation
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }

  if (!VALIDATION_PATTERNS.PHONE.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_PHONE };
  }

  return { isValid: true };
}

// Password validation
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password === '') {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }

  if (password.length < 8) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT };
  }

  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least 8 characters including uppercase, lowercase, and numbers'
    };
  }

  return { isValid: true };
}

// Required field validation
export function validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return { isValid: true };
}

// Number validation
export function validateNumber(
  value: any,
  fieldName: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const { min, max, required = false } = options;

  if (value === null || value === undefined || value === '') {
    if (required) {
      return {
        isValid: false,
        error: `${fieldName} is required`
      };
    }
    return { isValid: true };
  }

  const numValue = Number(value);

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `${fieldName} must be at most ${max}`
    };
  }

  return { isValid: true };
}

// Text length validation
export function validateTextLength(
  value: string,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const { minLength, maxLength, required = false } = options;

  if (!value || value.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: `${fieldName} is required`
      };
    }
    return { isValid: true };
  }

  const trimmedValue = value.trim();

  if (minLength !== undefined && trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long`
    };
  }

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters long`
    };
  }

  return { isValid: true };
}

// Array validation
export function validateArray(
  value: any,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const { minLength, maxLength, required = false } = options;

  if (!Array.isArray(value)) {
    if (required) {
      return {
        isValid: false,
        error: `${fieldName} is required`
      };
    }
    return { isValid: true };
  }

  if (minLength !== undefined && value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must contain at least ${minLength} items`
    };
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must contain no more than ${maxLength} items`
    };
  }

  return { isValid: true };
}

// Date validation
export function validateDate(
  value: any,
  fieldName: string,
  options: {
    minDate?: Date;
    maxDate?: Date;
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const { minDate, maxDate, required = false } = options;

  if (!value) {
    if (required) {
      return {
        isValid: false,
        error: `${fieldName} is required`
      };
    }
    return { isValid: true };
  }

  const dateValue = new Date(value);

  if (isNaN(dateValue.getTime())) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid date`
    };
  }

  if (minDate && dateValue < minDate) {
    return {
      isValid: false,
      error: `${fieldName} must be after ${minDate.toLocaleDateString()}`
    };
  }

  if (maxDate && dateValue > maxDate) {
    return {
      isValid: false,
      error: `${fieldName} must be before ${maxDate.toLocaleDateString()}`
    };
  }

  return { isValid: true };
}

// URL validation
export function validateURL(url: string, fieldName: string): { isValid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { isValid: true }; // URLs are typically optional
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: `${fieldName} must be a valid URL`
    };
  }
}

// File validation
export function validateFile(
  file: File,
  fieldName: string,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const { maxSize, allowedTypes, required = false } = options;

  if (!file) {
    if (required) {
      return {
        isValid: false,
        error: `${fieldName} is required`
      };
    }
    return { isValid: true };
  }

  if (maxSize && file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `${fieldName} must be smaller than ${sizeMB.toFixed(1)} MB`
    };
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `${fieldName} must be one of the following types: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
}

// Multi-field validation
export function validateForm(
  fields: Record<string, any>,
  validators: Record<string, (value: any) => { isValid: boolean; error?: string }>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, validator] of Object.entries(validators)) {
    const result = validator(fields[fieldName]);
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Farmer profile validation
export function validateFarmerProfile(profile: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(profile, {
    firstName: (value) => validateTextLength(value, 'First Name', { required: true, maxLength: 50 }),
    lastName: (value) => validateTextLength(value, 'Last Name', { required: true, maxLength: 50 }),
    farmName: (value) => validateTextLength(value, 'Farm Name', { required: true, maxLength: 100 }),
    email: validateEmail,
    phone: validatePhone,
    farmLocation: (value) => {
      if (!value || !value.address) {
        return { isValid: false, error: 'Farm location address is required' };
      }
      return { isValid: true };
    },
    farmSize: (value) => validateNumber(value, 'Farm Size', { required: true, min: 0.1, max: 10000 }),
    specialization: (value) => validateArray(value, 'Specialization', { required: true, minLength: 1, maxLength: 10 }),
    bio: (value) => validateTextLength(value, 'Bio', { maxLength: 500 }),
  });
}

// Buyer profile validation
export function validateBuyerProfile(profile: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(profile, {
    firstName: (value) => validateTextLength(value, 'First Name', { required: true, maxLength: 50 }),
    lastName: (value) => validateTextLength(value, 'Last Name', { required: true, maxLength: 50 }),
    email: validateEmail,
    phone: validatePhone,
    businessType: (value) => {
      if (!value || !['individual', 'restaurant', 'retailer', 'distributor'].includes(value)) {
        return { isValid: false, error: 'Please select a valid business type' };
      }
      return { isValid: true };
    },
    location: (value) => {
      if (!value || !value.address) {
        return { isValid: false, error: 'Business location address is required' };
      }
      return { isValid: true };
    },
    companyName: (value) => validateTextLength(value, 'Company Name', { maxLength: 100 }),
    bio: (value) => validateTextLength(value, 'Bio', { maxLength: 500 }),
  });
}

// Expert profile validation
export function validateExpertProfile(profile: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(profile, {
    firstName: (value) => validateTextLength(value, 'First Name', { required: true, maxLength: 50 }),
    lastName: (value) => validateTextLength(value, 'Last Name', { required: true, maxLength: 50 }),
    email: validateEmail,
    phone: validatePhone,
    title: (value) => validateTextLength(value, 'Title', { required: true, maxLength: 100 }),
    specialization: (value) => validateArray(value, 'Specialization', { required: true, minLength: 1, maxLength: 10 }),
    experience: (value) => validateNumber(value, 'Experience', { required: true, min: 0, max: 50 }),
    bio: (value) => validateTextLength(value, 'Bio', { maxLength: 1000 }),
    consultationRate: (value) => validateNumber(value, 'Consultation Rate', { min: 0, max: 1000 }),
    website: (value) => validateURL(value, 'Website'),
  });
}

// Product validation
export function validateProduct(product: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(product, {
    name: (value) => validateTextLength(value, 'Product Name', { required: true, maxLength: 100 }),
    description: (value) => validateTextLength(value, 'Description', { required: true, maxLength: 1000 }),
    category: (value) => validateTextLength(value, 'Category', { required: true, maxLength: 50 }),
    price: (value) => validateNumber(value, 'Price', { required: true, min: 0.01, max: 100000 }),
    quantity: (value) => validateNumber(value, 'Quantity', { required: true, min: 0, max: 1000000 }),
    unit: (value) => validateTextLength(value, 'Unit', { required: true, maxLength: 20 }),
    location: (value) => {
      if (!value || !value.address) {
        return { isValid: false, error: 'Product location address is required' };
      }
      return { isValid: true };
    },
  });
}

// Order validation
export function validateOrder(order: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(order, {
    buyerId: validateRequired,
    farmerId: validateRequired,
    products: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return { isValid: false, error: 'At least one product is required' };
      }
      return { isValid: true };
    },
    total: (value) => validateNumber(value, 'Total', { required: true, min: 0.01 }),
    deliveryAddress: (value) => {
      if (!value || !value.address) {
        return { isValid: false, error: 'Delivery address is required' };
      }
      return { isValid: true };
    },
  });
}

// Consultation validation
export function validateConsultation(consultation: any): { isValid: boolean; errors: Record<string, string> } {
  return validateForm(consultation, {
    farmerId: validateRequired,
    expertId: validateRequired,
    type: (value) => validateTextLength(value, 'Type', { required: true, maxLength: 100 }),
    description: (value) => validateTextLength(value, 'Description', { maxLength: 1000 }),
    duration: (value) => validateNumber(value, 'Duration', { min: 15, max: 480 }), // 15min to 8hrs
  });
}