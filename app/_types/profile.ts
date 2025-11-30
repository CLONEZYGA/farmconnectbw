export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'Debit Card' | 'Mobile Money' | 'Bank Transfer';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface UserProfile {
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
}
