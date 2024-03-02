
import { BsMinecartLoaded } from "react-icons/bs";
const MyOrders = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center">
        <div className="sm:w-[200px] sm:h-[200px] w-[180px] h-[180px] flex items-center justify-center rounded-full bg-gray-100">
          <BsMinecartLoaded className="sm:text-6xl text-5xl text-gray-500" />
        </div>

        <p className="mt-2 text-lg">No order placed yet.</p>
        <p className="text-center max-w-lg text-sm text-gray-600 mt-2 leading-normal">
          You have not placed any order yet. Please add items to your cart and
          checkout when you are ready to order.
        </p>
      </div>
    </div>
  );
};

export default MyOrders;
