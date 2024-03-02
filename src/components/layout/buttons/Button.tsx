import React from "react";

interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  type = "button",
  loading,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className="bg-primary text-white rounded cursor-pointer transition duration-300 hover:bg-primary/90 px-4 py-3  text-sm"
    >
      {loading ? "Loading...": label}
    </button>
  );
};

export default Button;
