"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#F5F5F4] rounded-3xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">SHSH</h1>
            <p className="text-[#6B6B6B] text-sm mt-1">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-[#E8E5E3] rounded-2xl text-[#0A0A0A] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-2xl text-[#0A0A0A] placeholder-[#B5B5B5] text-sm"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-white rounded-2xl text-[#0A0A0A] placeholder-[#B5B5B5] text-sm"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5B5B5] hover:text-[#6B6B6B] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] disabled:opacity-40 text-white text-sm font-medium rounded-2xl transition-colors cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#333] text-xs mt-6 tracking-wide">
          Secure access only
        </p>
      </div>
    </div>
  );
}
