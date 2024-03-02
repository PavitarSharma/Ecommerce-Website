import { IoMdClose } from "react-icons/io";
import { BsBagCheckFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  CartState,
  decrementQuantity,
  incrementQuantity,
  removeProductFromCart,
} from "../../../redux/slices/cartSlice";
import { ICartItem } from "../../../types";
import toast from "react-hot-toast";
import formatPrice from "../../../utils/formatPrice";
import { IoTrashOutline } from "react-icons/io5";
import { calculateCartTotals } from "../../../utils/calculateTotal";
import { UserState } from "../../../redux/slices/userSlice";
import { handleApiError } from "../../../utils/handleApiError";
import { decreaseCartQuantity, increaseCartQuantity, removeFromCart } from "../../../services";
import { AxiosError } from "axios";
interface ICartProps {
  setOpenCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<ICartProps> = ({ setOpenCart }) => {
  const navigate = useNavigate();

  const { carts } = useAppSelector(CartState);
  const { total } = calculateCartTotals(carts);

  const onClose = useCallback(() => setOpenCart(false), [setOpenCart]);

  const handleCheckout = () => {
    if (carts.length) {
      navigate("/cart");
      onClose();
    } else {
      toast.error("Please select a product for cart to checkout");
    }
  };

  return (
    <div className="fixed z-[1000] inset-0 bg-black/30">
      <div className="fixed w-[320px] right-0 top-0 bottom-0 h-screen bg-white">
        <div className="flex items-center justify-between h-14 px-4 border-b sticky top-0 left-0">
          <div className="flex items-center gap-2">
            <BsBagCheckFill size={22} className="text-primary" />
            <span className="text-primary mt-1">{carts?.length} items</span>
          </div>
          <button onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        {carts && carts?.length > 0 ? (
          <div className="p-4 overflow-y-auto h-[calc(100vh_-_80px)] flex flex-col gap-6">
            {carts?.map((item: ICartItem, index: number) => (
              <CartItem key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-40 flex-col gap-4">
            <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
              <FiShoppingCart size={56} className="text-gray-500" />
            </div>

            <p className="text-sm mt-2 opacity-80">
              Your shopping cart is empty!
            </p>
          </div>
        )}

        <div className="absolute bottom-6 left-0 right-0">
          <div
            onClick={handleCheckout}
            className="bg-primary cursor-pointer h-12 w-[94%] mx-auto rounded-full px-2 flex items-center justify-between py-1"
          >
            <span className="text-white font-semibold pl-4">Checkout</span>
            <div className="bg-white text-sm font-semibold h-full px-2 rounded-full text-primary flex items-center justify-center">
              {total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

const CartItem = ({ item }: { item: ICartItem }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector(UserState)

  const handleincrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in toincrease cart quantity.");
      return;
    }
    if (item.quantity >= item.product.stock) {
      toast.error("Insufficient stock");
      return;
    } else {
      try {
         dispatch(incrementQuantity(item.product._id));
        await increaseCartQuantity(item.product._id);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        toast.error(message);
      }
    }
  };

  // Decrement quantity function
  const handleDecrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in toincrease cart quantity.");
      return;
    }
    try {
      dispatch(decrementQuantity(item.product._id));
      await decreaseCartQuantity(item.product._id);
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

  const handleRemoveFromCart = async () => {
    if (!isAuth) {
      toast.error("Please log in toincrease cart quantity.");
      return;
    }
    try {
      dispatch(removeProductFromCart(item.product._id));
      await removeFromCart(item.product._id)
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

  const price = item.product.price;
  const quantity = item.quantity;
  const currency = item.product.currency;
  const total = price * quantity;

  const result = formatPrice(total, currency);
  return (
    <div className="flex items-center justify-between relative">
      <div className="flex gap-2 items-center">
        <div className="border w-8 rounded-full">
          <button
            onClick={handleDecrementQuantity}
            className="flex items-center justify-center h-6 w-full text-xl border-b"
          >
            {"-"}
          </button>
          <div className="flex items-center justify-center text-sm h-8">
            {item.quantity}
          </div>
          <button
            onClick={handleincrementQuantity}
            className="flex items-center h-6 justify-center  w-full  border-t"
          >
            {"+"}
          </button>
        </div>
        <div>
          <img
            src={item?.product?.image?.media.url || ""}
            alt={item?.product?.title}
            className="w-16 object-contain"
          />
        </div>

        <p className="text-primary">{formatPrice(price, currency)}</p>
      </div>

      <div>
        <p className="text-black font-semibold text-xs">{result}</p>
      </div>

      <button onClick={handleRemoveFromCart} className="top-2 right-2 absolute">
        <IoTrashOutline className="text-gray-500" />
      </button>
    </div>
  );
};
