import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const existing = await prisma.user.findUnique({ where: { username: "admin" } });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash("Admin@2024!Secure", 12);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      settings: {
        create: {
          externalDomain: "https://www.example.com",
          apiEndpoint: "/api/listings",
          apiKey: "",
        },
      },
    },
  });

  return NextResponse.json({ message: "Admin created", userId: user.id });
}
