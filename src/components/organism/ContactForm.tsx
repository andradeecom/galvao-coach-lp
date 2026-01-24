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

interface ContactFormProps {
  siteKey: string;
}

const ContactForm = ({ siteKey }: ContactFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string | undefined;
    type: "success" | "error";
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
      if (!(window as any).grecaptcha.ready)
        throw new Error("reCAPTCHA not loaded");
      const recaptchaToken = await (window as any).grecaptcha.execute(siteKey, {
        action: "submit",
      });
      const recaptchaResponse = await fetch("/api/recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recaptcha: recaptchaToken }),
      });
      const recaptchaData = await recaptchaResponse.json();
      if (recaptchaData.success) {
        const response = await axios.post("/api/save-contact", data);
        if (response.status === 201) {
          console.log("Formulário enviado com sucesso!");
          window.location.href = "/thank-you";
        } else alert("Erro ao enviar formulário!");
      } else {
        alert("Erro na verificação do reCAPTCHA!");
      }
    } catch (error) {
      setToast({
        message:
          (error as AxiosError<{ error: string }>).response?.data.error ||
          "Erro ao enviar formulário",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <Input
          placeholder="John Doe"
          name="name"
          register={register}
          error={errors.name}
          leftIcon={<User className="size-5 text-bgteam-primary-500" />}
        />
        <Input
          placeholder="Email"
          name="email"
          register={register}
          error={errors.email}
          leftIcon={<Mail className="size-5 text-bgteam-primary-500" />}
        />
        <Input
          placeholder="Phone"
          name="phone"
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
        <button className="btn btn-primary">
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <span id="button-text">Enviar</span>
          )}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
