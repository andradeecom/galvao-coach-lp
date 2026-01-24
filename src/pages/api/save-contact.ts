import type { APIRoute } from "astro";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import type { Database, BaseContact } from "@/types";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  const supabase = createClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SECRET_KEY,
  );

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
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Invalid content type. Expected application/json",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const {
      name,
      email,
      phone,
      privacy,
      utm_campaign,
      utm_medium,
      utm_content,
      utm_source,
      utm_term,
    }: BaseContact = await request.json();

    const ghlData = {
      name,
      email,
      phone,
      privacy,
      customField: {
        utm_campaign,
        utm_medium,
        utm_content,
        utm_source,
        utm_term,
      },
    };

    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Missing required fields: name, email, phone",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          email,
          phone,
          privacy,
        },
      ])
      .select();

    if (error) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: "Failed to save contact data (supabase)",
          error: (error as PostgrestError).message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const contactData = data[0];
    const emailData = {
      from: "BG Team <bernardo@galvaocoach.com>",
      to: ["bernardo@galvaocoach.com"],
      subject: "BG Team - Novo contacto!",
      html: `
        <h1>Olá Coach</h1>
        <h3>Um novo contacto acaba de se inscrever através do site!</h3>
        <p>Estes são os seus dados:</p>
        <p>Nome: ${contactData.name}</p>
        <p>Email: ${contactData.email}</p>
        <p>Telefone: ${contactData.phone}</p>
        <hr/>
        <p>Esta mensagem foi enviada porque alguém se inscreveu em galvaocoach.com</p>
      `,
    };
    // Send email to notify the coach
    await transporter.sendMail(emailData);

    const GHL_WEBHOOK = import.meta.env.GHL_WEBHOOK_URL;
    if (!GHL_WEBHOOK) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: "GHL_WEBHOOK_URL not found",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    // Send data to GHL webhook
    const response = await fetch(GHL_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ghlData),
    });
    if (!response.ok) {
      return new Response(
        JSON.stringify({
          status: 500,
          message: "Failed to save contact",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const responseData = await response.json();
    console.log("response from GHL -->", responseData);

    return new Response(
      JSON.stringify({
        status: 201,
        message: "Email confirmed and contact saved successfully",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Failed to save contact",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
