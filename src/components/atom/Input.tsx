import { AlertCircle } from "lucide-react";
import { type InputHTMLAttributes } from "react";
import type { UseFormRegister, FieldError } from "react-hook-form";

/**
 * TODO:
 * - Correct icons, create a new component for the Icon component and import here...
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightLabel?: string;
  placeholder?: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = (props: InputProps) => {
  const {
    label,
    rightLabel,
    placeholder,
    name,
    type = "text",
    register,
    error,
    leftIcon,
    rightIcon,
    ...rest
  } = props;

  return (
    <div className="mb-4">
      <label
        className={`input input-bordered input-primary flex items-center gap-2 text-bgteam-text ${error && "outline-bgteam-error outline-none active:focus:outline-bgteam-error"}`}
      >
        {leftIcon && <span>{leftIcon}</span>}
        <input
          type={type}
          className="grow"
          placeholder={placeholder}
          {...register(name)}
          {...rest}
        />
        {rightIcon && <span>{rightIcon}</span>}
      </label>

      {/* <label
        className="block text-custom-dark dark:text-custom-light text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex items-center">
        {leftIcon && <span className="-m-5 z-10">{leftIcon}</span>}
        <input
          id={name}
          type={type}
          className={`border ${error ? "border-custom-error" : "border-custom-primary-200"} rounded-lg w-full py-3 px-4 ${leftIcon && "pl-10"} ${rightIcon && "pr-10"} text-custom-dark leading-tight bg-custom-light ${error ? "focus:outline-custom-error" : "focus:outline-custom-primary-200"} outline-offset-4`}
          {...register(name)}
          {...rest}
        />
        {rightIcon && <span className="-ml-5 z-10">{rightIcon}</span>}
      </div> */}
      {error && (
        <div className="flex gap-1 items-center mt-2">
          <AlertCircle className="text-bgteam-error" size={16} />
          <p className="text-bgteam-error text-xs">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
