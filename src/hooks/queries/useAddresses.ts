
import { AxiosError } from "axios";
import  { useEffect, useState } from "react";
import { axiosPrivate } from "../../config/api";
import { handleApiError } from "../../utils/handleApiError";
import { useAppDispatch } from "../../redux/hooks";
import { setAddresses } from "../../redux/slices/userSlice";



const useAddresses = () => {
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
        const { data } = await axiosPrivate.get("/customers/profile/address", { signal });
        dispatch(setAddresses(data))
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
      abortController.abort();
    };
  }, [dispatch]);

  return {
    isLoading,
    isError,
    error,
  }
};

export default useAddresses;
