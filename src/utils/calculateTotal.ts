
import { ICartItem} from "../types";
import formatPrice from "./formatPrice";

export const calculateCartTotals = (cart: ICartItem[]) => {
  let subtotal = 0;
  let totalShipping = 0;
  let currency = ""; // Initialize currency
  // let discountTotal = 0;

  // Calculate subtotal, total shipping, and determine the currency
  cart?.forEach((item) => {
    const {
      price,
      discountPrice: discountPercentage,
      shippingPrice,
    } = item.product;

    // Calculate discounted price if discount percentage is provided
    const discountedPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    subtotal += discountedPrice * item.quantity;
    totalShipping += shippingPrice * item.quantity;

    // Set the currency based on the first item in the cart
    if (!currency) {
      currency = item.product.currency;
    }
  });

  // Calculate total cost
  const total = subtotal + totalShipping;

  // Format the totals according to the determined currency
  const formattedSubtotal = formatPrice(subtotal, currency);
  const formattedTotalShipping = formatPrice(totalShipping, currency);
  const formattedTotal = formatPrice(total, currency);

  return {
    subtotal: formattedSubtotal,
    totalShipping: formattedTotalShipping,
    total: formattedTotal,
  };
};

export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number
) => {
  if (discountPercentage <= 0 || discountPercentage >= 100) {
    return price;
  }
  const discount = (price * discountPercentage) / 100;
  return price - discount;
};

export const calculateCartTotalPrice = (cart: ICartItem[]) => {
  let subtotal = 0;
  let totalShipping = 0;
  let currencySymbol = "";

  const currencySymbolToCode: { [key: string]: string } = {
    "₹": "INR",
    "$": "USD",
    "€": "EUR",
  };

  // Calculate subtotal, total shipping, and determine the currency
  cart?.forEach((item) => {
    const {
      price,
      discountPrice: discountPercentage,
      shippingPrice,
      currency: itemCurrencySymbol, 
    } = item.product;

   
  

    // Calculate discounted price if discount percentage is provided
    const discountedPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    subtotal += discountedPrice * item.quantity;
    totalShipping += shippingPrice * item.quantity;

    // Set the currency based on the first item in the cart
    if (!currencySymbol) {
      currencySymbol = itemCurrencySymbol;
    }
  });

  const currencyCode = currencySymbolToCode[currencySymbol] || currencySymbol;

  // Calculate total cost
  return  {
    total: subtotal + totalShipping,
    currencyCode,
  };

  
};

