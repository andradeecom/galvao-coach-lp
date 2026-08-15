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
        className={`flex h-12 items-center gap-2 rounded-lg border bg-bgteam-primary-100 px-4 text-base text-bgteam-text focus-within:outline-2 focus-within:outline-offset-2 ${
          error
            ? "border-bgteam-error focus-within:outline-bgteam-error"
            : "border-bgteam-primary-500 focus-within:outline-bgteam-primary-500"
        }`}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <input
          type={type}
          className="grow bg-transparent placeholder:text-bgteam-text/60 focus:outline-none"
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
          {...rest}
        />
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
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
          <p id={`${name}-error`} className="text-bgteam-error text-xs">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Input;
