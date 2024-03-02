import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LuKeyRound } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { ChangePasswordSchema } from "../../../schemas";
import { axiosPrivate } from "../../../config/api";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/handleApiError";
import toast from "react-hot-toast";
import { useState } from "react";
import Input from "../../layout/inputs/Input";
import Button from "../../layout/buttons/Button";

type Schema = z.infer<typeof ChangePasswordSchema>;
const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors, dirtyFields, touchedFields },
    handleSubmit,
    watch,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: Schema) => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.patch(
        "/customers/profile/update-password",
        {
          newPassword: data.password,
          ...data,
        }
      );
      toast.success("Password updated successfully");
      reset();
      return response.data;
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

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Validation functions
  const validations: Record<string, () => boolean> = {
    "Minimum 8 Characters": () => !!password && password.length >= 8,
    Number: () => !!password && /\d/.test(password),
    Letter: () => !!password && /\w/.test(password),
    "Special Character": () => !!password && /\W/.test(password),
    "Passwords Match": () => {
      return !!password && !!confirmPassword && dirtyFields.confirmPassword
        ? password === confirmPassword
        : false;
    },
  };

  return (
    <>
      <div className="p-4">
        <h4 className="font-semibold mb-4 text-sm">Change Password</h4>
        <form className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <Input
              type="password"
              id="password"
              register={register}
              label="New Password"
              error={errors.password?.message}
              icon={LuKeyRound}
              placeholder="***************"
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <Input
              type="password"
              id="confirmPassword"
              register={register}
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              icon={LuKeyRound}
              placeholder="***************"
            />
          </div>

          <div>
            <p className="opacity-70">Password must contains</p>

            <div className="flex flex-col gap-2 my-2">
              {Object.entries(validations).map(([title, validationFn]) => (
                <PassowrdValidation
                  key={title}
                  title={title}
                  isValid={validationFn()}
                  isError={
                    title === "Passwords Match"
                      ? (!!password || !!confirmPassword) && !validationFn()
                      : !!touchedFields.password &&
                        !!touchedFields.confirmPassword &&
                        !validationFn()
                  }
                />
              ))}
            </div>
          </div>

          <div className="w-[150px]">
            <Button
              disabled={isLoading}
              loading={isLoading}
              label="Change Password"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;

const PassowrdValidation = ({
  title,
  isValid,
  isError,
}: {
  title: string;
  isValid?: boolean;
  isError?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      {isError ? (
        <IoIosCloseCircle size={18} className="text-red-600" />
      ) : (
        <FaCheckCircle
          size={16}
          className={isValid ? "text-green-600" : "text-gray-400"}
        />
      )}

      <span className="text-sm font-medium text-gray-600">{title}</span>
    </div>
  );
};
