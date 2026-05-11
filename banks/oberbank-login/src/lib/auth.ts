export type Device = {
  id: string;
  label: string;
};

export type StartLoginRequest = {
  bankingNr: string;
  pin: string;
  lang: string;
};

export type StartLoginResponse = {
  sessionId: string;
  pruefziffer: string;
  devices: Device[];
};

export type ConfirmLoginRequest = {
  sessionId: string;
  deviceId: string;
};

export type ConfirmLoginResponse = {
  status: "pending" | "approved" | "rejected";
  redirectUrl?: string;
};

export async function startLogin(
  body: StartLoginRequest,
): Promise<StartLoginResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`startLogin failed: ${res.status}`);
  return res.json();
}

export async function confirmLogin(
  body: ConfirmLoginRequest,
): Promise<ConfirmLoginResponse> {
  const res = await fetch("/api/login/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`confirmLogin failed: ${res.status}`);
  return res.json();
}
