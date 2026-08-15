import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { User, Mail, PhoneCall } from "lucide-react";
import { regexPatterns } from "@/config/utils/constants";
import Input from "@/components/atom/Input";
import Checkbox from "@/components/atom/Checkbox";
import Toast from "@/components/molecule/Toast";

const schema = z.object({
  name: z.string().min(3, "Nome é um campo obrigatório"),
  email: z
    .string()
    .email("Endereço de email inválido")
    .min(1, "Email é um campo obrigatório"),
  phone: z
    .string()
    .min(9, "Número de telefone deve ter no mínimo 9 dígitos")
    .regex(regexPatterns.PHONE, "Número de telefone inválido"),
  privacy: z.boolean(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  utm_source: z.string().optional(),
  utm_term: z.string().optional(),
});

type ContactFormInputs = z.infer<typeof schema>;

const SUBMIT_ERROR_MESSAGE =
  "Não foi possível enviar o teu contacto. Por favor tenta novamente ou escreve-nos para bernardo@galvaocoach.com";

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string | undefined;
    type: "success" | "error";
    duration?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(schema),
  });

  // Extract UTM parameters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = [
      "utm_campaign",
      "utm_medium",
      "utm_content",
      "utm_source",
      "utm_term",
    ] as const;

    utmParams.forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        setValue(param, value);
      }
    });
  }, [setValue]);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (
    data: ContactFormInputs,
  ) => {
    setIsLoading(true);
    try {
      const token =
        (window as any).turnstile?.getResponse("#turnstile-widget") ?? null;

      if (!token) throw new Error("Turnstile token not available");

      const turnstileResponse = await fetch("/api/turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const turnstileData = await turnstileResponse.json();

      if (turnstileData.success) {
        // axios rejects on non-2xx, so a failed save lands in the catch below.
        await axios.post("/api/save-contact", data);
        window.location.href = "/thank-you";
      } else {
        (window as any).turnstile?.reset("#turnstile-widget");
        setToast({
          message:
            "Verificação de segurança falhou. Por favor tenta novamente.",
          type: "error",
        });
      }
    } catch (error) {
      // The lead was not saved. Tell them how to reach the coach directly so
      // the contact is not simply lost.
      setToast({
        message: SUBMIT_ERROR_MESSAGE,
        type: "error",
        duration: 10000,
      });
      console.error(
        "Contact form submission failed -->",
        (error as AxiosError<{ error: string }>).response?.data ?? error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <Input
          label="Nome"
          placeholder="Joana Santos"
          name="name"
          register={register}
          error={errors.name}
          leftIcon={<User className="size-5 text-bgteam-primary-500" />}
        />
        <Input
          label="Email"
          placeholder="joana@santos.pt"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          leftIcon={<Mail className="size-5 text-bgteam-primary-500" />}
        />
        <Input
          label="Telefone"
          placeholder="912 345 678"
          name="phone"
          type="tel"
          register={register}
          error={errors.phone}
          leftIcon={<PhoneCall className="size-5 text-bgteam-primary-500" />}
        />
        <Checkbox
          name="privacy"
          register={register}
          error={errors.privacy}
          isRequired
        />
        {/* Hidden UTM inputs */}
        <input type="hidden" {...register("utm_campaign")} />
        <input type="hidden" {...register("utm_medium")} />
        <input type="hidden" {...register("utm_content")} />
        <input type="hidden" {...register("utm_source")} />
        <input type="hidden" {...register("utm_term")} />
        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="inline-flex h-12 min-h-12 shrink-0 cursor-pointer flex-wrap items-center justify-center gap-2 rounded-lg bg-bgteam-primary-600 px-4 text-center text-sm font-semibold text-bgteam-light transition-colors duration-200 hover:bg-bgteam-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgteam-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span
              role="status"
              aria-label="A enviar"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></span>
          ) : (
            <span id="button-text">Enviar</span>
          )}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
