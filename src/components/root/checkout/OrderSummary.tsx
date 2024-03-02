import { useAppSelector } from "../../../redux/hooks";
import { CartState } from "../../../redux/slices/cartSlice";
import { ICartItem } from "../../../types";
import { calculateCartTotals } from "../../../utils/calculateTotal";
import formatPrice from "../../../utils/formatPrice";

const OrderSummary = () => {
  const { carts } = useAppSelector(CartState);
  const { subtotal, total } = calculateCartTotals(carts);

  return (
    <div className="w-full bg-white rounded-md shadow p-2 py-4">
      <div className="w-full flex flex-col gap-4">
        {carts &&
          carts?.length > 0 &&
          carts.map((cart: ICartItem) => (
            <div key={cart?._id} className="flex gap-2 w-full">
              <div className="w-[100px] h-[100px]">
                <img
                  src={cart?.product?.image.media.url}
                  alt={cart?.product?.title}
                  className="object-contain w-full h-full rounded-md"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-medium text-sm line-clamp-2">{cart?.product?.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Quanitity: <span>{cart?.quantity}</span>
                  </p>
                  <p className="text-gray-700">
                    {formatPrice(cart?.product?.price, cart?.product?.currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="w-full h-[1px] bg-gray-200 my-8"></div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="opacity-70 text-sm">Subtotal:</span>
          <span className="opacity-70 text-sm">{subtotal}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Total:</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
