import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  isLGPD?: boolean;
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  isRequired?: boolean;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    isLGPD = true,
    label,
    name,
    register,
    error,
    isRequired = false,
    ...rest
  } = props;
  return (
    <label className="flex items-center justify-start gap-4 mb-4 cursor-pointer">
      <input
        type="checkbox"
        className="size-6 shrink-0 cursor-pointer appearance-none rounded-lg border border-bgteam-primary-500 bg-bgteam-primary-100 checked:bg-bgteam-primary-500 checked:bg-[length:100%_100%] checked:bg-center checked:bg-no-repeat checked:bg-[image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%223.5%208.5%206.5%2011.5%2012.5%204.5%22%2F%3E%3C%2Fsvg%3E')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgteam-primary-500"
        required={isRequired}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
        {...rest}
      />
      {label && <span className="text-sm">{label}</span>}
      {isLGPD && (
        <span className="text-sm">
          Aceito a{" "}
          <a
            className="underline hover:no-underline"
            aria-label="política de privacidade"
            href="/privacy-policy"
            target="_blank"
          >
            política de privacidade
          </a>{" "}
          e ser contatado para efeitos comerciais.
        </span>
      )}
      {error && (
        <p id={`${name}-error`} className="text-bgteam-error text-xs mt-2">
          {error.message}
        </p>
      )}
    </label>
  );
};

export default Checkbox;
