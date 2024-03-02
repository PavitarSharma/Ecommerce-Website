import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCustomerProfile } from "../../services";
import { setUserProfile } from "../../redux/slices/userSlice";

const useProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetcahProfile = async () => {
      try {
        const data = await fetchCustomerProfile();
        dispatch(setUserProfile(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetcahProfile();
  }, [dispatch]);
  return;
};

export default useProfile;
