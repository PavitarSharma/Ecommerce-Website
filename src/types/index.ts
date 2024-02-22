export type Image = {
  id: string;
  url: string;
};

export type Address = {
  city: string;
  state: string;
  zipCode: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  ip: string;
};

export interface RegisterCustomer {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  device: string;
  acceptTerms: boolean;
}

export interface VerifyEmail {
  otp: number;
  hash: string;
}

export interface TokenPayload {
  id: string;
}
