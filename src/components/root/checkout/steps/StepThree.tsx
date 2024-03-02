/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  CardExpiryElement,
  CardNumberElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import { CartState } from "../../../../redux/slices/cartSlice";
import { calculateCartTotalPrice } from "../../../../utils/calculateTotal";
import Button from "../../../layout/buttons/Button";
import { axiosInstance } from "../../../../config/api";
import toast from "react-hot-toast";
import { createOrder } from "../../../../services";
import { AxiosError } from "axios";
import { handleApiError } from "../../../../utils/handleApiError";

export interface StepThreeRef {}

interface StepThreeProps {
  getValues: any;
}

const StepThree: React.ForwardRefRenderFunction<
  StepThreeRef,
  StepThreeProps
> = ({ getValues }, ref) => {
  const [active, setActive] = useState(1);
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolder, setCardHolder] = useState("");
  const navigate = useNavigate();

  const { carts } = useAppSelector(CartState);
  const { total: totalAmount, currencyCode } = calculateCartTotalPrice(carts);
  const onChange = (_e: React.ChangeEvent<HTMLInputElement>, val: number) => {
    setActive(active === val ? 0 : val);
  };
  const onClick = (val: number) => setActive(active === val ? 0 : val);
  const isValidFormat = (value: string): boolean => {
    const regex = /^\d{2}\/\d{2}$/;
    return regex.test(value);
  };

  const paymentHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (!stripe || !elements) {
    //   return;
    // }

    // const data = await createOrderMutation(orderData)
    // navigate(`/order/success?orderId=${data._id}`)

    try {
      const paymentData = {
        amount: 10,
        currency: currencyCode,
      };
      const { data } = await axiosInstance.post(
        "/payment/process",
        paymentData
      );
      console.log(data);

      const client_secret = data.client_secret;
      const cardElement = elements?.getElement(CardNumberElement);
      if (!cardElement) {
        // Handle case where card element is not available
        console.error("Card element is not available");
        return;
      }
      const result = await stripe?.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          // billing_details: {
          //   name: cardHolder // Get cardholder's name from form
          // },
        },
      });

      if (result?.error) {
        // Show error to your customer
        console.error(result?.error);
        toast.error(result?.error?.message as string);
      } else {
        console.log(result);

        // Payment successful
        if (result?.paymentIntent.status === "succeeded") {
          const orderData = {
            cart: carts,
            totalPrice: totalAmount,
            shippingAddress: {
              city: getValues("city"),
              state: getValues("state"),
              country: getValues("country"),
              zipcode: getValues("zipcode"),
              address: getValues("address"),
            },
            paymentInfo: {
              id: "123456",
              status: "success",
              type: "Card",
            },
            customer: {
              name: getValues("name"),
              email: getValues("email"),
              phone: getValues("phone"),
            },
          };
          // const data = await createOrder(orderData)
          // Payment completed successfully
          console.log("Payment succeeded:", result.paymentIntent);
        }
      }

      // const { data} = await axiosInstance.post("/payment/process")
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    }
  };

  useImperativeHandle(ref, () => ({}));

  const paypalPaymentHandler = async () => {
    const orderData = {
      cart: carts,
      totalPrice: totalAmount,
      shippingAddress: {
        city: getValues("city"),
        state: getValues("state"),
        country: getValues("country"),
        zipcode: getValues("zipcode"),
        address: getValues("address"),
      },
      paymentInfo: {
        id: "123456",
        status: "success",
        type: "Paypal",
      },
      customer: {
        name: getValues("name"),
        email: getValues("email"),
        phone: getValues("phone"),
      },
    };
    // const data = await createOrderMutation(orderData)
    // router.push(`/order/success?orderId=${data._id}`)
  };

  const cashOnDeliveryHandler = async () => {
    onClick(3);
    const orderData = {
      cart: carts,
      totalPrice: totalAmount,
      shippingAddress: {
        city: getValues("city"),
        state: getValues("state"),
        country: getValues("country"),
        zipcode: getValues("zipcode"),
        address: getValues("address"),
      },
      paymentInfo: {
        id: "123456",
        status: "pending",
        type: "Cash On Delivery",
      },
      customer: {
        name: getValues("name"),
        email: getValues("email"),
        phone: getValues("phone"),
      },
    };
    // const data = await createOrderMutation(orderData)
    // router.push(`/order/success?orderId=${data._id}`)
  };

  const paymentMode =
    active === 1
      ? "Debit/Credit"
      : active === 2
      ? "Paypal"
      : "Cash on Delivery";

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => onClick(1)}
        className="w-full bg-white shadow-sm rounded-md p-4 border relative cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <input
            id="list-radio-license"
            checked={active === 1}
            onChange={(e) => onChange(e, 1)}
            type="radio"
            value=""
            name="list-radio"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300   outline-none"
          />
          <p className="font-medium">Pay With Debit/Credit Card</p>
        </div>

        {active === 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`py-4 bg-white transition duration-300`}
          >
            <form
              onSubmit={paymentHandler}
              className="flex flex-col gap-3 w-full p-5"
            >
              <label className="relative w-full flex flex-col">
                <span className="font-bold mb-1">Cardholder&#39;s Name</span>
                <input
                  className={`rounded-md outline-none peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300`}
                  type="text"
                  value={cardHolder}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setCardHolder(event.target.value)
                  }
                  name="cardHolder"
                  placeholder="John Doe"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-400  h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </label>
              <label className="relative w-full flex flex-col">
                <span className="font-bold mb-1">Card number</span>

                <CardNumberElement
                  className={`rounded-md peer pl-12 pr-2 py-3 border-2 border-gray-200 placeholder-gray-300`}
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#444",
                      },
                      empty: {
                        color: "#999999",
                        backgroundColor: "transparent",
                        "::placeholder": {
                          color: "#99999970",
                        },
                      },
                    },
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </label>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                <label className="relative flex-1 flex flex-col">
                  <span className="font-bold mb-1">Expire date</span>
                  <CardExpiryElement
                    className={`rounded-md peer pl-12 pr-2 py-3 border-2 border-gray-200 placeholder-gray-300`}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",

                          color: "#444",
                        },
                        empty: {
                          color: "#99999930",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#99999970",
                          },
                        },
                      },
                    }}
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
                <label className="relative flex-1 flex flex-col">
                  <span className="font-bold flex items-center gap-3 mb-1">
                    CVC/CVV
                    <span className="relative group">
                      <span className="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 transform translate-x-full -translate-y-1/2 w-max top-1/2 bg-black text-white">
                        Hey ceci est une infobulle !
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </span>
                  <CardCvcElement
                    className={`rounded-md peer pl-12 pr-2 py-3 border-2 border-gray-200 placeholder-gray-300`}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#444",
                        },
                        empty: {
                          color: "#99999930",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#99999970",
                          },
                        },
                      },
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </label>
              </div>
              <div className="mt-4 max-w-[150px] w-full">
                <Button type="submit" label="Submit" onClick={() => {}} />
              </div>
            </form>
          </div>
        )}
      </div>

      <div
        onClick={() => onClick(2)}
        className="w-full bg-white shadow-sm rounded-md p-4 border relative cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <input
            id="list-radio-license"
            checked={active === 2}
            onChange={(e) => onChange(e, 2)}
            type="radio"
            value=""
            name="list-radio"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300   outline-none"
          />
          <p className="font-medium">Pay With Paypal</p>
        </div>

        {active === 2 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`py-4 bg-white transition duration-300`}
          >
            <div className="max-w-[200px] w-full">
              <Button label="Pay Now" onClick={paypalPaymentHandler} />
            </div>
          </div>
        )}
      </div>

      <div
        onClick={cashOnDeliveryHandler}
        className="w-full bg-white shadow-sm rounded-md p-4 border relative cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <input
            id="list-radio-license"
            checked={active === 3}
            onChange={(e) => onChange(e, 3)}
            type="radio"
            value=""
            name="list-radio"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300   outline-none"
          />
          <p className="font-medium">Cash On Delivery</p>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(StepThree);
