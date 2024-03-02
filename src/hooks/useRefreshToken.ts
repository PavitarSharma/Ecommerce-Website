import { axiosInstance } from "../config/api";
import { useAppDispatch } from "../redux/hooks";
import { setCredentials } from "../redux/slices/userSlice";


const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  const refresh = async () => {
    const { data } = await axiosInstance.get("/customers/refresh", {
      withCredentials: true,
    });

    dispatch(setCredentials(data));

    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
