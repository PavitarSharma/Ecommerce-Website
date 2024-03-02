/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { IconType } from "react-icons";
import { LuEyeOff, LuEye } from "react-icons/lu";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  register: any
  placeholder?: string;
  error?: string;
  type?: string;
  icon?: IconType;
  hasBg?: boolean;
}
const Input: React.FC<InputProps> = ({
  label,
  id,
  register,
  placeholder,
  error,
  type = "text",
  icon: Icon,
  hasBg,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  return (
    <div>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="w-full relative">
        {Icon && (
          <Icon className="absolute top-1/2 -translate-y-1/2 left-2 cursor-pointer text-gray-600" />
        )}
        <input
          type={inputType}
          id={id}
          {...register(id)}
          placeholder={placeholder}
          autoComplete="off"
          className={`border border-gray-300 w-full p-2 rounded-md text-gray-900 text-sm font-normal focus:outline-0 ${
            Icon && "pl-8"
          } ${hasBg && "bg-gray-50"}`}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-600"
          >
            {showPassword ? <LuEye /> : <LuEyeOff />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
