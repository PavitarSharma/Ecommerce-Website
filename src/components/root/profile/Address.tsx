import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi2";
import { AddressSchema } from "../../../schemas";
import useGeolocation from "../../../hooks/useGeoLocation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  UserState,
  setDeleteAddress,
  setEditAddress,
  setSaveAddress,
  setToggleActiveAddress,
} from "../../../redux/slices/userSlice";
import Input from "../../layout/inputs/Input";
import Button from "../../layout/buttons/Button";
import { TAddress } from "../../../types";
import {
  addAddress,
  deleteAddress,
  toggleAddress,
  updateAddress,
} from "../../../services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";

type Schema = z.infer<typeof AddressSchema>;

const Address = () => {
  const coordinates = useGeolocation();
  const { addresses } = useAppSelector(UserState);
  const dispatch = useAppDispatch();
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(AddressSchema),
  });

  const savedEditAddress = async (data: Schema) => {
    try {
      const response = await updateAddress(editAddressId as string, data);
      dispatch(setEditAddress(response));
      toast.success("Address updated successfully");
      window.location.reload()
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

  const savedAddress = async (data: Schema) => {
    try {
      const response = await addAddress(data);
      dispatch(setSaveAddress(response));
      toast.success("Address created successfully");
      window.location.reload()
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

  const onSubmit = async (data: Schema) => {
    const responseData = {
      ...data,
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };

    if (editAddressId) {
      await savedEditAddress(responseData);
    } else {
      await savedAddress(responseData);
    }
    setValue("address", "");
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
    setValue("zipcode", "");
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      dispatch(setDeleteAddress(addressId));
      toast.success("Address deleted successfully");
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

  const handleEditAddress = (address: TAddress) => {
    setEditAddressId(address._id);
    setValue("address", address.address);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("country", address.country);
    setValue("zipcode", address.zipcode);
  };

  return (
    <>
      <form className="p-4">
        <Input
          id="address"
          register={register}
          label="Your Address"
          error={errors.address?.message}
        />

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-4">
          <Input
            id="country"
            register={register}
            label="Country"
            error={errors.country?.message}
          />

          <Input
            id="state"
            register={register}
            label="State"
            error={errors.state?.message}
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-4">
          <Input
            id="city"
            register={register}
            label="City"
            error={errors.city?.message}
          />

          <Input
            id="zipcode"
            register={register}
            label="Zip Code"
            error={errors.zipcode?.message}
          />
        </div>
        <div className="w-[120px]">
          <Button label="Save" onClick={handleSubmit(onSubmit)} />
        </div>
      </form>

      <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
        {addresses &&
          addresses.length > 0 &&
          addresses.map((obj: TAddress, index: number) => {
            return (
              <AddressCard
                key={index}
                address={obj}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
              />
            );
          })}
      </div>
    </>
  );
};

export default Address;

const Location = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string | number;
}) => {
  return (
    <div className="flex gap-2 pr-4">
      <span className="text-sm text-gray-600">{title}: </span>
      <span className="text-sm text-gray-500">{subTitle}</span>
    </div>
  );
};

const AddressCard = ({
  address,
  handleEditAddress,
  handleDeleteAddress,
}: {
  address: TAddress;
  handleEditAddress: (id: TAddress) => void;
  handleDeleteAddress: (id: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const handdleToggleAddress = async () => {
    try {
      await toggleAddress(address._id);
      dispatch(setToggleActiveAddress(address._id));
      toast.success("Address activated successfully");
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


  return (
    <div
      className={`border border-gray-300 rounded-md p-2 flex flex-col gap-2 cursor-pointer relative`}
    >
      <div className="absolute right-4 top-2">
        <div
          className={`${
            address.isActive &&
            "w-5 h-5 rounded-full border border-primary p-[2px] flex items-center justify-center"
          }`}
        >
          <div
            onClick={handdleToggleAddress}
            className={` rounded-full ${
              address.isActive
                ? "bg-primary w-3 h-3"
                : "bg-gray-300 w-4 h-4 border"
            }`}
          ></div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button onClick={() => handleEditAddress(address)} type="button">
          <FaRegEdit size={18} className="text-blue-600 cursor-pointer" />
        </button>

        <button type="button" onClick={() => handleDeleteAddress(address._id)}>
          <HiOutlineTrash size={18} className="text-primary cursor-pointer" />
        </button>
      </div>

      <Location title="Address" subTitle={address.address} />
      <Location title="City" subTitle={address.city} />
      <Location title="State" subTitle={address.state} />
      <Location title="Country" subTitle={address.country} />
      <Location title="Zip Code" subTitle={address.zipcode} />
      <Location title="Lat" subTitle={address.lat} />
      <Location title="Lng" subTitle={address.lng} />
    </div>
  );
};
