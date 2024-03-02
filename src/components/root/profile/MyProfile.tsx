/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMail, FiUser, FiPhone } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { UserState, setUserProfile } from "../../../redux/slices/userSlice";
import { EditProfileSchema } from "../../../schemas";
import { axiosPrivate } from "../../../config/api";
import { editProfile } from "../../../services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";
import Input from "../../layout/inputs/Input";
import TextArea from "../../layout/inputs/TextArea";
import Button from "../../layout/buttons/Button";

type Schema = z.infer<typeof EditProfileSchema>;
const MyProfile = () => {
  const { user } = useAppSelector(UserState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { register, setValue, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(EditProfileSchema),
  });
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("username", user.username);
      setValue("bio", user.bio);
    }
  }, [user, setValue]);

  const onSubmit = async (values: Schema) => {
    setIsLoading(true);
    try {
      const data = await editProfile(values);
      dispatch(setUserProfile(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const editProfileImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];
    const loading = toast.loading("Uploading...");
    try {
      const formData = new FormData();
      formData.append("profileImg", file);
      const {data} = await axiosPrivate.patch(
        "/customers/profile/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(setUserProfile(data));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    } finally {
      toast.dismiss(loading);
    }
  };

  return (
    <>
      <div className="w-[200px] h-[200px] relative border-2 rounded-full border-primary/40">
        <img
          src={user?.profileImg ? user?.profileImg.url : "/images/user.png"}
          alt="profile"
          className="rounded-full object-cover w-full h-full"
        />
        <label
          htmlFor="profileImg"
          className="absolute bottom-8 right-2 flex items-center justify-center"
        >
          <input
            id="profileImg"
            type="file"
            ref={hiddenFileInput}
            onChange={editProfileImage}
            accept="image/*"
            hidden
          />
          <button onClick={handleClick} className="text-2xl text-gray-600 ">
            <FaRegEdit />
          </button>
        </label>
      </div>

      <form className="w-full p-4 flex flex-col gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <Input
            id="name"
            register={register}
            placeholder="John Doe"
            icon={FiUser}
            label="Name"
          />

          <Input
            id="email"
            register={register}
            placeholder="john.doe@email.com"
            icon={FiMail}
            label="Email"
            readOnly
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <Input
            id="phone"
            register={register}
            placeholder="+1 123-123-123"
            icon={FiPhone}
            label="Phone"
          />

          <Input
            id="username"
            register={register}
            placeholder="@john"
            icon={MdAlternateEmail}
            label="Username"
          />
        </div>
        <TextArea register={register} id="bio" label="Bio" />

        <div className="w-[120px]">
          <Button
            disabled={isLoading}
            loading={isLoading}
            label="Save"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </>
  );
};

export default MyProfile;
