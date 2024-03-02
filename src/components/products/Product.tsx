import { ICartItem, IProduct } from "../../types";
import { MdShoppingBasket } from "react-icons/md";
import formatPrice from "../../utils/formatPrice";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserState } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  addToCart,
  addToWishlist,
  decreaseCartQuantity,
  increaseCartQuantity,
} from "../../services";
import { handleApiError } from "../../utils/handleApiError";
import {
  addProductToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import {
  CartState,
  addProductsToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../redux/slices/cartSlice";
import AddToCart from "../layout/AddToCart";
import { calculateDiscountedPrice } from "../../utils/calculateTotal";

const Product = ({ product }: { product: IProduct }) => {
  const { _id, images, title, price, discountPrice, currency, like, stock } =
    product;
  const { isAuth } = useAppSelector(UserState);
  const [isLike, setIsLike] = useState(like);
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(CartState);
  const discount = calculateDiscountedPrice(price, discountPrice);
  const formatDicountPrice = formatPrice(discount, currency);

  const handleAddToWishlist = async () => {
    if (!isAuth) {
      toast.error("Please log in to add products to your wishlist.");
      return;
    } else {
      try {
        const updatedLike = !isLike;
        setIsLike(updatedLike);

        if (updatedLike) {
          const data = await addToWishlist(_id, true);

          dispatch(addProductToWishlist(data));
          toast.success("Added To Wishlist");
        } else {
          const data = await addToWishlist(_id, false);
          console.log(updatedLike);
          dispatch(removeFromWishlist(data));
          toast.success("Removed From Wishlist");
          return data;
        }
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

  const totalQuantityInCart = carts
    .filter((item: ICartItem) => item.product._id === _id)
    .reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = async () => {
    if (!isAuth) {
      toast.error("Please log in to add products to your cart.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sizes, images, discountPrice, price, ...updatedProductCart } = {
        ...product,
        size: product.sizes[0],
        image: {
          media: product.images[0].medias[0],
          color: product.images[0].color,
        },
      };

      const cartProduct = {
        ...updatedProductCart,
        price: discount,
      };

      await addToCart(cartProduct, 1);
      dispatch(addProductsToCart(cartProduct));
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

  const handleincrementQuantity = async () => {
    if (!isAuth) {
      toast.error("Please log in to increase cart quantity.");
      return;
    }
    if (totalQuantityInCart >= stock) {
      toast.error("Insufficient stock");
      return;
    } else {
      try {
        dispatch(incrementQuantity(_id));
        await increaseCartQuantity(_id);
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
      dispatch(decrementQuantity(_id));
      await decreaseCartQuantity(_id);
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

  const hasProductInCart = carts?.some(
    (item: ICartItem) => item.product._id === _id
  );

  

  return (
    <div className="relative w-full bg-white rounded-md">
      <Link to={`/product/${_id}`} className="h-[350px] w-full block">
        <img
          src={images[0].medias[0].url}
          alt={title}
          className="rounded-t-md w-full h-full object-contain mx-auto"
        />
      </Link>
      {discountPrice > 0 && (
        <div className="text-xs bg-red-400 absolute top-4 left-4 text-white py-1 px-2 rounded-md">
          {discountPrice}% off
        </div>
      )}

      <button onClick={handleAddToWishlist} className="absolute top-2 right-2">
        {isLike ? (
          <IoIosHeart size={20} className="text-primary" />
        ) : (
          <IoIosHeartEmpty size={20} className="text-gray-600" />
        )}
      </button>

      <div className="p-2">
        <p className="text-sm font-semibold opacity-70 line-clamp-2">{title}</p>

        <div className="flex justify-between mt-4 items-center">
          <div className="flex flex-col">
            {discountPrice > 0 && (
              <del className="text-xs opacity-60 italic">
                {formatPrice(price, currency)}
              </del>
            )}
            <span className="font-semibold text-primary">
              {formatDicountPrice}
            </span>
          </div>
          {hasProductInCart ? (
            <AddToCart
              total={totalQuantityInCart}
              increment={handleincrementQuantity}
              decrement={handleDecrementQuantity}
            />
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 p-2 px-4 rounded-full border hover:bg-primary hover:text-white transition duration-300"
            >
              <MdShoppingBasket />
              <span className="text-sm">Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
