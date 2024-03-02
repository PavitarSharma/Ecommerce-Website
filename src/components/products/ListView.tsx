import React, { useState } from "react";
import { ICartItem, IProduct } from "../../types";
import { Link } from "react-router-dom";
import { CgEye } from "react-icons/cg";
import { MdShoppingBasket } from "react-icons/md";
import { IoIosHeartEmpty } from "react-icons/io";
import formatPrice from "../../utils/formatPrice";
import { Rating } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserState } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import {
  addToCart,
  addToWishlist,
  decreaseCartQuantity,
  increaseCartQuantity,
} from "../../services";
import {
  addProductToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { handleApiError } from "../../utils/handleApiError";
import { AxiosError } from "axios";
import {
  CartState,
  addProductsToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../redux/slices/cartSlice";
import AddToCart from "../layout/AddToCart";
import { calculateDiscountedPrice } from "../../utils/calculateTotal";

interface IListViewProps {
  product: IProduct;
}
const ListView: React.FC<IListViewProps> = ({ product }) => {
  const {
    _id,
    images,
    title,
    price,
    discountPrice,
    rating,
    description,
    currency,
    like,
    stock,
  } = product;

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
      const { sizes, images, discountPrice,price,  ...updatedProductCart } = {
        ...product,
        size: product.sizes[0],
        image: {
          media: product.images[0].medias[0],
          color: product.images[0].color,

        },
      };

      const cartProduct = {
        ...updatedProductCart,
        price: discount
      }
      
      await addToCart(cartProduct, 1);
      dispatch(addProductsToCart(cartProduct));
      toast.success("Added To Cart");
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
    <div className="w-full bg-white rounded-md flex gap-4 min-[576px]:flex-row flex-col">
      <div className=" h-[200px] min-[576px]:w-[200px] flex items-center justify-center">
        <img
          src={images[0].medias[0].url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain rounded-md my-auto"
        />
      </div>
      <div className="flex-1 min-[576px]:pl-0 pl-4 py-2 pr-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold opacity-90">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-primary text-xl">
            {formatDicountPrice}
          </span>
          {discountPrice > 0 && (
            <del className="text-sm opacity-60 italic">
              {formatPrice(price, currency)}
            </del>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Rating
            defaultValue={rating.rate}
            precision={0.5}
            readOnly
            size="small"
          />
          <span className="text-sm opacity-60">({rating.count}) reviews</span>
        </div>

        <p className="text-xs my-2 text-gray-600 line-clamp-4">{description}</p>
        <div className="flex items-center gap-4 pb-4">
          <Link
            to={`/product/${_id}`}
            className="flex items-center justify-center gap-2 p-2 px-4 rounded-full border hover:bg-primary hover:text-white transition duration-30"
          >
            <CgEye />
            <span className="text-sm">View</span>
          </Link>
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

          <button
            onClick={handleAddToWishlist}
            className={`flex items-center justify-center gap-2 p-2 px-4 rounded-full border ${isLike  ? "text-primary border-primary": ""} hover:bg-primary hover:text-white transition duration-300`}
          >
            <IoIosHeartEmpty  />
            <span className={`text-sm`}>Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListView;
