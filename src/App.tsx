import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import {
  About,
  AddProduct,
  AdminOrders,
  AdminProducts,
  AdminUsers,
  Cart,
  Checkout,
  Contact,
  ForgotPassword,
  Home,
  Login,
  NewArrival,
  OrderSuccess,
  Product,
  Profile,
  Register,
  ResetPassword,
  Shop,
  VerifyEmail,
  Wishlist,
} from "./pages";
import { Toaster } from "react-hot-toast";
import useWishlists from "./hooks/queries/useWishlists";
import useCarts from "./hooks/queries/useCarts";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { UserState, setAddresses } from "./redux/slices/userSlice";
import { useEffect } from "react";
import { setCart } from "./redux/slices/cartSlice";
import { setWishlists } from "./redux/slices/wishlistSlice";
import AdminLayout from "./layouts/AdminLayout";
import useAddresses from "./hooks/queries/useAddresses";
import useProfile from "./hooks/queries/useProfile";

function App() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector(UserState);
  useWishlists();
  useCarts();
  useAddresses()
  useProfile()

  useEffect(() => {
    if (!isAuth) {
      dispatch(setCart([]));
      dispatch(setWishlists([]));
      dispatch(setAddresses([]));
    }
  }, [isAuth, dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/register" element={<Register />} />
          <Route path="auth/forgot-password" element={<ForgotPassword />} />
          <Route path="auth/verify-email" element={<VerifyEmail />} />
          <Route path="auth/reset-password" element={<ResetPassword />} />
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="success" element={<OrderSuccess />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="new-arrivals" element={<NewArrival />} />
          <Route path="profile" element={<Profile />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;
