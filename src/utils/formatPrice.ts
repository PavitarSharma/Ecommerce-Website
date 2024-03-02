export default function formatPrice(price: number, currency: string) {
  // Define locale based on currency
  let locale: string;
  switch (currency) {
    case "$":
      locale = "en-US";
      break;
    case "₹":
      locale = "en-IN";
      break;
    case "€":
      locale = "en-DE";
      break;
    default:
      locale = "en-US"; // Default to en-US
  }

  // Define options based on currency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let options: any;
  switch (currency) {
    case "$":
      options = { style: "currency", currency: "USD" };
      break;
    case "₹":
      options = { style: "currency", currency: "INR" };
      break;
    case "€":
      options = { style: "currency", currency: "EUR" };
      break;
    default:
      options = { style: "currency", currency: "USD" }; // Default to USD
  }

  // Format the price
  return new Intl.NumberFormat(locale, options).format(price);
}


