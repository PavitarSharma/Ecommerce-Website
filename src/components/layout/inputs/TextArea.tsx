/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  register: any;
  placeholder?: string;
  error?: string;
  hasBg?: boolean;
  cols?: number;
}
const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  register,
  placeholder,
  error,
  hasBg,
  cols = 10,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-900">
          {label}
        </label>
      )}
      <textarea
        type="text"
        id={id}
        {...register(id)}
        placeholder={placeholder}
        autoComplete="off"
        cols={cols}
        className={`border h-32 resize-none border-gray-300 w-full p-2 rounded-md text-gray-900 text-sm font-normal  focus:outline-0 ${
          hasBg && "bg-gray-50"
        }`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
