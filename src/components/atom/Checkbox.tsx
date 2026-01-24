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
    <label className="label justify-start gap-4 mb-4">
      <input
        type="checkbox"
        className="checkbox checkbox-primary"
        required={isRequired}
        {...register(name)}
        {...rest}
      />
      {label && <span className="label-text">{label}</span>}
      {isLGPD && (
        <span className="label-text">
          Aceito a{" "}
          <a
            className="link"
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
        <p className="text-bgteam-error text-xs mt-2">{error.message}</p>
      )}
    </label>
  );
};

export default Checkbox;
