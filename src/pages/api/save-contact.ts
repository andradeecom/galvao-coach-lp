import type { APIRoute } from "astro";
import type { BaseContact } from "@/types";
import { upsertContact } from "@/lib/ghl";
import nodemailer from "nodemailer";

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify({ status, ...body }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port: parseInt(import.meta.env.SMTP_PORT || "465"), // Use 587 for TLS, 465 for SSL
    secure: true, // Use true if you're connecting over SSL/TLS
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
  });

  try {
    if (!request.headers.get("Content-Type")?.includes("application/json")) {
      return json(400, {
        message: "Invalid content type. Expected application/json",
      });
    }

    const contact: BaseContact = await request.json();
    const { name, email, phone } = contact;

    if (!name || !email || !phone) {
      return json(400, {
        message: "Missing required fields: name, email, phone",
      });
    }

    // Save the lead in GoHighLevel first — it is the system of record, so a
    // failure here must surface to the visitor rather than be swallowed.
    const { contactId, isNew } = await upsertContact(contact);
    console.log("contact upserted in GHL -->", { contactId, isNew });

    // Notify the coach. The lead is already safe in the CRM at this point.
    await transporter.sendMail({
      from: "BG Team <bernardo@galvaocoach.com>",
      to: ["bernardo@galvaocoach.com"],
      subject: "BG Team - Novo contacto!",
      html: `
        <h1>Olá Coach</h1>
        <h3>Um novo contacto acaba de se inscrever através do site!</h3>
        <p>Estes são os seus dados:</p>
        <p>Nome: ${name}</p>
        <p>Email: ${email}</p>
        <p>Telefone: ${phone}</p>
        <hr/>
        <p>Esta mensagem foi enviada porque alguém se inscreveu em galvaocoach.com</p>
      `,
    });

    return json(201, {
      message: "Contact saved successfully",
      contactId,
    });
  } catch (error) {
    console.error("save-contact failed -->", error);
    return json(500, {
      message: "Failed to save contact",
      error: (error as Error).message,
    });
  }
};
