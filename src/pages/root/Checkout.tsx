import CheckoutInformation from "../../components/root/checkout/CheckoutInformation";
import OrderSummary from "../../components/root/checkout/OrderSummary";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

const Checkout = () => {
  return (
    <StripeProvider>
      <div className="container py-4 my-8 flex lg:flex-row flex-col gap-8">
        <div className="flex-1">
          <CheckoutInformation />
        </div>
        <div className="lg:w-[500px] w-full">
          <OrderSummary />
        </div>
      </div>
    </StripeProvider>
  );
};

export default Checkout;
