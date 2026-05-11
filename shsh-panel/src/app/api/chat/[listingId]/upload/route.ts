import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { corsResponse, corsOptions } from "@/lib/cors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return corsResponse({ error: "No file provided" }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return corsResponse({ error: "File type not allowed. Use jpg, png, gif, or webp." }, 400);
  }

  if (file.size > MAX_SIZE) {
    return corsResponse({ error: "File too large. Max 5MB." }, 400);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const path = join(process.cwd(), "public", "uploads", filename);

  await writeFile(path, bytes);

  return corsResponse({ url: `/uploads/${filename}` }, 201);
}
