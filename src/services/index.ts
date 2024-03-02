/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance, axiosPrivate } from "../config/api";

export const editProfile = async (data: any) => {
  const response = await axiosPrivate.patch("/customers/profile", data);
  return response.data;
};

export const sendVerificationMail = async (email: string) => {
  const response = await axiosInstance.post("/customers/resend-verification", {
    email,
  });
  return response.data;
};

export const fetchCustomerProfile = async () => {
  const response = await axiosPrivate.get("/customers/profile");
  return response.data;
};

export const addToWishlist = async (productId: string, like: boolean) => {
  const response = await axiosPrivate.post("/customers/wishlist", {
    productId,
    like,
  });
  return response.data;
};

export const removeWishlist = async () => {
  const response = await axiosPrivate.delete("/customers/wishlist");
  return response.data;
};

export const addToCart = async (product: any, quantity: number) => {
  const response = await axiosPrivate.post("/customers/cart/add", {
    product,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  console.log(productId);

  const response = await axiosPrivate.post("/customers/cart/remove", {
    productId,
  });
  return response.data;
};

export const increaseCartQuantity = async (productId: string) => {
  const response = await axiosPrivate.post("/customers/cart/increase", {
    productId,
  });
  return response.data;
};

export const decreaseCartQuantity = async (productId: string) => {
  const response = await axiosPrivate.post("/customers/cart/decrease", {
    productId,
  });
  return response.data;
};

export const removeAllItemsFromCart = async () => {
  const response = await axiosPrivate.delete("/customers/cart/remove-all");
  return response.data;
};

export const addProduct = async (data: any) => {
  const response = await axiosPrivate.post("/products", data);
  return response.data;
};

export const addAddress = async (data: any) => {
  const response = await axiosPrivate.post("/customers/profile/address", data);
  return response.data;
};

export const updateAddress = async (addressId: string, data: any) => {
  const response = await axiosPrivate.patch(
    `/customers/profile/address/${addressId}`,
    { ...data }
  );
  return response.data;
};

export const toggleAddress = async (addressId: string) => {
  const response = await axiosPrivate.patch(
    `/customers/profile/address/${addressId}/active`
  );
  return response.data;
};

export const deleteAddress = async (addressId: string) => {
  
  const response = await axiosPrivate.delete(
    `/customers/profile/address/${addressId}`
  );
  return response.data;
};

export const createOrder = async (data: any) => {
  const response = await axiosPrivate.post("/orders/create-order", data);
  return response.data;
};
