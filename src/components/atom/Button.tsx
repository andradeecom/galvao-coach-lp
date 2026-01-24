import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button = (props: ButtonProps) => {
  const {
    label,
    leftIcon,
    rightIcon,
    className,
    onClick,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={`bg-custom-primary-500 hover:bg-custom-primary-400 text-custom-light font-bold py-3 px-5 flex gap-2 items-center rounded-lg focus:outline-none focus:shadow-outline ${className}`}
      onClick={onClick}
      {...rest}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {label}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
