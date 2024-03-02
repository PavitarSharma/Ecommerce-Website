
import { AxiosError } from "axios";
import  { useEffect, useState } from "react";
import { axiosPrivate } from "../../config/api";
import { handleApiError } from "../../utils/handleApiError";
import { useAppDispatch } from "../../redux/hooks";
import { setCart } from "../../redux/slices/cartSlice";


const useCarts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
    const dispatch = useAppDispatch()

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setError("");
      try {
        const { data } = await axiosPrivate.get("customers/cart", { signal });
        dispatch(setCart(data))
        setIsLoading(false);
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        setIsLoading(false);
        setIsError(true);
        setError(message);
      }
    };

    fetchProducts();

    return () => {
      // Cancel the request when the component unmounts
      abortController.abort();
    };
  }, [dispatch]);

  return {
    isLoading,
    isError,
    error,
  }
};

export default useCarts;
