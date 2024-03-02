
import { AxiosError } from "axios";
import  { useEffect, useState } from "react";
import { IProduct } from "../../types";
import { axiosInstance } from "../../config/api";
import { handleApiError } from "../../utils/handleApiError";

interface Params {
  category?: string;
  page?: number;
  limit?: number;
  query?: string;
  color?: string,
  price? : number,
  size?: string,
  sort?: string,
  type?: string,
}

const useProducts = ({
  category,
  page = 1,
  limit = 9,
  query,
  color,
  price,
  size,
  sort,
  type,
}: Params = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);

  let url = `/products?page=${page}&limit=${limit}`;
  if (query) {
    url += `&q=${query}`;
  }
  if (category) {
    url += `&category=${category}`;
  }
  if (color) {
    url += `&color=${color}`;
  }
  if (price) {
    url += `&price=${price}`;
  }
  if (size) {
    url += `&size=${size}`;
  }
  if (sort) {
    url += `&sortBy=${sort}`;
  }
  if (type) {
    url += `&type=${type}`;
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setError("");
      try {
        const { data } = await axiosInstance.get(url, { signal });
        setProducts(data);
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
  }, [url]);

  return {
    products,
    isLoading,
    isError,
    error,
  }
};

export default useProducts;
