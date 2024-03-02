/* eslint-disable @typescript-eslint/no-explicit-any */
export type Option = {
  label: string;
  value: string
}

export interface IImage {
  id?: string;
  url: string;
}

export type TMedia = {
  medias: IImage[];
  color: string
}

export type Location = {
  lat: number;
  lng: number;
};
export type TAddress = {
  _id: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  ip?: string;
  isActive?: boolean;
};

export interface IUser  {
  name: string;
  email: string;
  phone: string
  bio: string,
  username: string,
  location: any[]
  profileImg: IImage;
  verified: boolean,
  carts: ICartItem[],
  wishlists: IProduct[],
  orders: any[],
  roles: string[],
  device: string;
  loginDevices: any[],
  acceptTerms: boolean;
  addresses: TAddress[],
}

export interface IProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  sku: string;
  barcode: string;
  images: {
   medias: IImage[],
   color: string
  }[];
  discountType: string;
  discountPrice: number;
  shippingPrice: number;
  createdAt: string;
  updatedAt: string;
  like: boolean;
  currency: string;
  sizes: string[];
  condition: string;
  type: string;
  purchased: number;
  colors: string[];
  quality: string;
}

export interface ICart {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  sku: string;
  barcode: string;
  discountType: string;
  discountPrice: number;
  shippingPrice: number;
  createdAt: string;
  updatedAt: string;
  like: boolean;
  currency: string;
  condition: string;
  type: string;
  purchased: number;
  quality: string;
  image: {
    media: IImage,
    color: string
  };
  size: string;
}

export interface IReview {
  _id: string;
  message: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    _id: string;
    name: string;
    email: string;
    profileImg?: IImage;
  };
}

export interface ICartItem {
  product: ICart;
  quantity: number;
  _id?: string;
}

export interface IOrder {
  cart: ICartItem[];
  customer: {
    name: string;
    email: string;
    profileImg?: IImage;
    id: string;
  };
  createdAt: Date;
  status: string;
  totalPrice: number;
  shippingAddress: {
    city: string;
    state: string;
    zipcode: string;
    country: string;
    address: string;
  };
  paymentInfo: {
    id: string;
    status: string;
    type: string;
  };
  paidAt: Date;
  orderId: string;
  _id: string;
}
