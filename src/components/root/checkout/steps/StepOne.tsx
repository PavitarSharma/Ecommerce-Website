/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Control, Controller } from "react-hook-form";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi2";
import useGeolocation from "../../../../hooks/useGeoLocation";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { UserState, setEditAddress } from "../../../../redux/slices/userSlice";
import { TAddress } from "../../../../types";
import Button from "../../../layout/buttons/Button";
import { AxiosError } from "axios";
import { handleApiError } from "../../../../utils/handleApiError";
import toast from "react-hot-toast";
import {
  deleteAddress,
  toggleAddress,
  updateAddress,
} from "../../../../services";

interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

const StepOne = ({
  control,
  setValue,
  getValues,
}: {
  control: Control<FormData>;
  setValue: any;
  getValues: any;
}) => {
  const coordinates = useGeolocation();
  const { addresses } = useAppSelector(UserState);
  const [existingAddress, setExistingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [chooseAddress, setChooseAddress] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const toggleExistingAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExistingAddress(event.target.checked);
  };

  useEffect(() => {
    const activeAddress = addresses.find((address) => address.isActive);
    if (activeAddress) {
      setChooseAddress(activeAddress._id);
      setValue("address", activeAddress.address);
      setValue("city", activeAddress.city);
      setValue("state", activeAddress.state);
      setValue("country", activeAddress.country);
      setValue("zipcode", activeAddress.zipcode);
    }
  }, [addresses, setValue]);

  const handleEditAddress = (address: TAddress) => {
    setEditAddressId(address._id);
    setValue("address", address.address);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("country", address.country);
    setValue("zipcode", address.zipcode);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
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

  const handleToggleActive = useCallback(
    async (address: TAddress) => {
      try {
        setChooseAddress(address._id);
        setValue("address", address.address);
        setValue("city", address.city);
        setValue("state", address.state);
        setValue("country", address.country);
        setValue("zipcode", address.zipcode);
        await toggleAddress(address._id);
        toast.success("Address activated");
      } catch (error) {
        let message;

        if (error instanceof AxiosError) {
          message = handleApiError(error);
        } else {
          message = "An unexpected error occurred.";
        }
        toast.error(message);
      }
    },

    [setValue]
  );

  const savedEditAddress = async () => {
    const address = getValues("address");
    const city = getValues("city");
    const state = getValues("state");
    const country = getValues("country");
    const zipcode = getValues("zipcode");
    if (editAddressId) {
      const responseData = {
        address,
        city,
        state,
        country,
        zipcode,
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      };
      try {
        await updateAddress(editAddressId, responseData);
        dispatch(
          setEditAddress({
            _id: editAddressId,
            ...responseData,
          })
        );
        toast.success("Address updated successfully");
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

  return (
    <div>
      <form className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <Controller
            defaultValue=""
            control={control}
            name="name"
            render={({ field, formState: { errors } }) => (
              <input
                type="text"
                {...field}
                placeholder="First name*"
                className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                  errors.name?.message ? "border-red-600" : "border-gray-300"
                }`}
              />
            )}
          />
          <Controller
            defaultValue=""
            control={control}
            name="email"
            render={({ field, formState: { errors } }) => (
              <input
                type="email"
                {...field}
                placeholder="Email*"
                className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                  errors.email?.message ? "border-red-600" : "border-gray-300"
                }`}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          defaultValue=""
          name="phone"
          render={({ field, formState: { errors } }) => (
            <PhoneInput
              defaultCountry="IN"
              placeholder="Phone*"
              {...field}
              className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                errors.phone?.message ? "border-red-600" : "border-gray-300"
              }`}
            />
          )}
        />
        <div className="w-full flex flex-col gap-4">
          <Controller
            defaultValue=""
            control={control}
            name="address"
            render={({ field, formState: { errors } }) => (
              <input
                type="text"
                {...field}
                placeholder="Street Address*"
                className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                  errors.address?.message ? "border-red-600" : "border-gray-300"
                }`}
              />
            )}
          />
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <Controller
              defaultValue=""
              control={control}
              name="city"
              render={({ field, formState: { errors } }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="City*"
                  className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                    errors.city?.message ? "border-red-600" : "border-gray-300"
                  }`}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="state"
              render={({ field, formState: { errors } }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="State*"
                  className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                    errors.state?.message ? "border-red-600" : "border-gray-300"
                  }`}
                />
              )}
            />
            <Controller
              defaultValue=""
              control={control}
              name="zipcode"
              render={({ field, formState: { errors } }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Zip Code*"
                  className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                    errors.zipcode?.message
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                />
              )}
            />
            <Controller
              control={control}
              name="country"
              defaultValue=""
              render={({ field, formState: { errors } }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Country*"
                  className={`w-full py-3 px-2 border rounded-md text-sm outline-none ${
                    errors.country?.message
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                />
              )}
            />
          </div>
          {editAddressId && (
            <div className="w-[120px]">
              <Button label="Save Address" onClick={savedEditAddress} />
            </div>
          )}
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={existingAddress}
                onChange={toggleExistingAddress}
              />
            }
            label="Use Existing Address"
          />
        </FormGroup>
        {existingAddress && (
          <div className="w-full flex flex-col gap-4">
            {addresses &&
              addresses?.length > 0 &&
              addresses?.map((address: TAddress) => (
                <Addresses
                  key={address._id}
                  address={address}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  handleToggleActive={handleToggleActive}
                  chooseAddress={chooseAddress || ""}
                />
              ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default StepOne;

const Addresses = ({
  address,
  handleEditAddress,
  handleDeleteAddress,
  handleToggleActive,
  chooseAddress,
}: {
  address: TAddress;
  handleEditAddress: (address: TAddress) => void;
  handleToggleActive: (address: TAddress) => void;
  handleDeleteAddress: (id: string) => void;
  chooseAddress: string;
}) => {
  return (
    <div className="border rounded-md p-4 flex gap-4 items-start relative">
      <div
        className={`${
          address._id.toString() === chooseAddress &&
          "w-5 h-5 rounded-full border border-primary p-[2px] flex items-center justify-center mt-[2px]"
        }`}
      >
        <div
          onClick={() => handleToggleActive(address)}
          className={` rounded-full ${
            address._id.toString() === chooseAddress
              ? "bg-primary w-3 h-3"
              : "bg-gray-300 w-4 h-4 border"
          }`}
        ></div>
      </div>

      <div className="flex-1">
        <p>{address?.address}</p>

        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-600">{address.city}</p>
          <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
          <p className="text-xs text-gray-600">{address.state}</p>
          <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
          <p className="text-xs text-gray-600">{address.country}</p>
          <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
          <p className="text-xs text-gray-600">{address.zipcode}</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button onClick={() => handleEditAddress(address)} type="button">
          <FaRegEdit size={18} className="text-blue-600 cursor-pointer" />
        </button>
        <button type="button" onClick={() => handleDeleteAddress(address._id)}>
          <HiOutlineTrash size={18} className="text-primary cursor-pointer" />
        </button>
      </div>
    </div>
  );
};
