import type { BaseContact } from "@/types";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export interface GHLUpsertResult {
  contactId: string;
  isNew: boolean;
}

/**
 * GHL models contacts as firstName/lastName, but the form collects a single
 * `name`. Split on the first space: first word is the first name, the rest
 * (however many words) becomes the last name.
 */
export const splitName = (name?: string) => {
  const trimmed = name?.trim().replace(/\s+/g, " ") ?? "";
  if (!trimmed) return { firstName: "", lastName: "" };

  const separatorIndex = trimmed.indexOf(" ");
  if (separatorIndex === -1) return { firstName: trimmed, lastName: "" };

  return {
    firstName: trimmed.slice(0, separatorIndex),
    lastName: trimmed.slice(separatorIndex + 1),
  };
};

/**
 * Create or update a contact in GoHighLevel. Uses /contacts/upsert so a lead
 * submitting twice updates their existing contact rather than duplicating it —
 * GHL matches on email/phone per the location's "Allow Duplicate Contact"
 * setting.
 */
export const upsertContact = async (
  contact: BaseContact,
): Promise<GHLUpsertResult> => {
  const apiToken = import.meta.env.GHL_API_TOKEN;
  const locationId = import.meta.env.GHL_LOCATION_ID;

  if (!apiToken) throw new Error("GHL_API_TOKEN is not configured");
  if (!locationId) throw new Error("GHL_LOCATION_ID is not configured");

  const { firstName, lastName } = splitName(contact.name);

  // Only send UTMs that are actually present, so an empty value never
  // overwrites a UTM captured on an earlier submission by the same lead.
  const customFields = (
    [
      "utm_campaign",
      "utm_medium",
      "utm_content",
      "utm_source",
      "utm_term",
    ] as const
  )
    .filter((key) => contact[key])
    .map((key) => ({ key, field_value: contact[key] as string }));

  const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      source: "galvaocoach.com",
      tags: ["landing-page"],
      ...(customFields.length > 0 && { customFields }),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GHL upsert failed (${response.status}): ${body.slice(0, 500)}`,
    );
  }

  const data = await response.json();

  return {
    contactId: data?.contact?.id ?? "",
    isNew: Boolean(data?.new),
  };
};
