"use client";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useCarts from "../../hooks/queries/useCarts";
import {
  CartState,
  decrementQuantity,
  incrementQuantity,
  removeAllFromCart,
  removeProductFromCart,
} from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { ICartItem } from "../../types";
import formatPrice from "../../utils/formatPrice";
import Button from "../../components/layout/buttons/Button";
import { FiShoppingCart } from "react-icons/fi";
import AddToCart from "../../components/layout/AddToCart";
import { BsTrash } from "react-icons/bs";
import { MdOutlineChevronLeft } from "react-icons/md";
import { calculateCartTotals } from "../../utils/calculateTotal";
import {
  decreaseCartQuantity,
  increaseCartQuantity,
  removeAllItemsFromCart,
  removeFromCart,
} from "../../services";
import { UserState } from "../../redux/slices/userSlice";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { carts } = useAppSelector(CartState);
  const { isAuth } = useAppSelector(UserState);
  const { isLoading } = useCarts();

  const { subtotal, totalShipping, total } = calculateCartTotals(carts);

  const handleCheckout = () => {
    if (!isAuth) {
      toast.error("Please login to checkout");
      navigate("/login");
    }
    if (carts?.length) {
      navigate("/checkout");
    } else {
      toast.error("Please select a product for cart to checkout");
    }
  };

  const handleRemoveAllFromCart = async () => {
    if (!isAuth) {
      toast.error("Please log in remove cart.");
      return;
    }
    try {
      dispatch(removeAllFromCart());
      await removeAllItemsFromCart();
      toast.success("All items removed from cart");
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

  return (
    <div className="container my-8">
      {isLoading ? (
        "Loading..."
      ) : carts && carts.length > 0 ? (
        <div className="flex lg:flex-row flex-col gap-8">
          <div className="flex-1">
            <div className="w-full rounded-md bg-white shadow">
              <div className="border-b border-b-gray-300 h-10 flex items-center justify-between px-4">
                <p>Shoping Cart</p>
                <span
                  onClick={handleRemoveAllFromCart}
                  className="text-sm text-primary cursor-pointer"
                >
                  Remove All
                </span>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-6">
                {carts.map((item: ICartItem, index: number) => {
                  return <CartItem key={index} item={item} />;
                })}
              </div>
            </div>

            <Link
              to={"/shop"}
              className="flex items-center mt-2 hover:underline"
            >
              <MdOutlineChevronLeft size={20} />
              <span className="text-sm">Continue Shopping</span>
            </Link>
          </div>

          <div className="lg:w-[450px] h-[220px] bg-white shadow rounded-md">
            <div className="p-4 border-b border-gray-300 flex flex-col gap-2">
              <CartCheckoutDetail
                title={`${carts?.length} items`}
                subTitle={`${subtotal}`}
              />
              <CartCheckoutDetail
                title={`Shipping`}
                subTitle={`${totalShipping}`}
              />
            </div>

            <div className="p-4 flex flex-col gap-2">
              <CartCheckoutDetail title={`Total`} subTitle={`${total}`} />
              {/* <CartCheckoutDetail
                title={`Total(tax incl.)`}
                subTitle={`${total}`}
              />
              <CartCheckoutDetail title={`Taxes`} subTitle={`₹00.00`} /> */}

              <div className="mt-4 mx-auto">
                <Button label="PROCEED TO CHECKOUT" onClick={handleCheckout} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 my-6 flex items-center justify-center flex-col max-w-md mx-auto">
          <div className="sm:w-48 sm:h-48 w-44 h-44 rounded-full bg-gray-100 flex items-center justify-center">
            <FiShoppingCart className="text-gray-500 sm:text-[100px] text-[80px]" />
          </div>

          <p className="sm:text-lg  mt-2 opacity-80">
            Your shopping cart is empty!
          </p>

          <p className="text-center text-sm opacity-80 my-2">
            You have have not added any products to your <br />
            <span className="capitalize">shopping cart</span>
          </p>
          <div className="mt-4">
            <Button
              label="Continue Shopping"
              onClick={() => navigate("/shop")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

const CartItem = ({ item }: { item: ICartItem }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector(UserState);

  const handleincrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in to increase cart quantity.");
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
      toast.error("Please log in to decrease cart quantity.");
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
      toast.error("Please log in to remove item from cart");
      return;
    }
    try {
      dispatch(removeProductFromCart(item.product._id));
      await removeFromCart(item.product._id);
      toast.success("Item removed from cart");
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

  return (
    <div key={item._id} className="flex justify-between gap-4 w-full">
      <img
        src={item?.product?.image?.media.url || ""}
        alt={item?.product?.title}
        width={100}
        height={100}
        className="border h-[100px] rounded-md object-cover"
      />
      <div className="flex md:items-center flex-1 gap-4 justify-between md:flex-row flex-col ">
        <div className="flex-1">
          <h4 className="font-semibold line-clamp-2">{item?.product?.title}</h4>
          <h5 className="text-primary font-medium">
            {formatPrice(item?.product?.price, item?.product?.currency)}
          </h5>
          <div className="flex items-center gap-2 my-1">
            <span className="text-sm font-medium">Size:</span>
            <span className="text-sm font-normal opacity-70">
              {item?.product?.size}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color:</span>
            <span className="text-sm capitalize font-normal opacity-70">
              {item?.product?.image.color}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 flex-1">
          <AddToCart
            total={item?.quantity}
            increment={handleincrementQuantity}
            decrement={handleDecrementQuantity}
          />

          <h5 className="text-primary text-lg font-medium">
            {formatPrice(
              item?.product?.price * item?.quantity,
              item?.product?.currency
            )}
          </h5>

          <button onClick={handleRemoveFromCart} className="text-black">
            <BsTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CartCheckoutDetail = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      <span className="font-semibold text-sm">{title}</span>
      <span className="font-semibold text-sm text-primary">{subTitle}</span>
    </div>
  );
};
